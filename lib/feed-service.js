import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import { chromium } from 'playwright';
import {fileTypeFromBuffer} from 'file-type';
//import axios from 'axios';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import launchContext from "./browser-context.js"
import prisma from './prisma.js';
import watchdog from './watchdog.js';
import executeActions from "./actions.js"
import executeTransformer from "./transform.js"

class FeedService {

  /**
   * Get pending feeds
   * 
   */
  async getPendingFeeds(limitNum) {

	let filters = {
		take: limitNum, // Limit to page size
		where: {
		  //published:true, //种子需要已经发布
		  grade: { lt: 4 },  //A,B.C,D, 4为D，废弃的，不用抓取
		  fetchStatus: { not: 2 }, //抓取状态不等于2， 2表示抓取失败的，
		  nextTime: {
			lte: new Date(), //下次运行时间小于当前时间
		  },
		},
		include: {
		  template: true,
		},		
	};
	
	const feeds = await prisma.feed.findMany(filters);
	
    return feeds;
  }
  
  /**
   * Get pending list pages
   * 
   */
  async getPendingListPages(limitNum) {
    //列表默认只抓取一次，但是可以修改这里的代码，进行调度
	let filters = {
		take: limitNum, // Limit to page size
		where: {
		  fetchStatus: 0, //抓取状态等于0
		},
		include: {
		  feed: {
			include: {
				template: true,
            },				
		  },
		},
	};
	
	const listpages = await prisma.listpage.findMany(filters);
	
    return listpages;
  }
  
  /**
   * Get pending items
   * 
   */
  async getPendingItems(limitNum) {

    //item默认只抓取一次，但是可以修改这里的代码，进行调度
	let filters = {
		take: limitNum, // Limit to page size
		where: {
		  fetchStatus: 0, //抓取状态等于0
		},
		include: {
		  feed: {
			include: {
				template: true,
            },				
		  },
		},
	};
	
	const items = await prisma.item.findMany(filters);
	
    return items;
  } 

  async testUrlOnly(arg) {

	let ret = false;
	let url = arg.url || "";
	let timeout = parseInt(arg.timeout) || 60000;
	
	if(url == ""){
	  return ret;	
	}
	
	try {
		
	 const context = await launchContext();
	 const page = context.pages()[0];
     //const page = await context.newPage();	 
	 //await page.setDefaultNavigationTimeout(0);
	 
	  //ret =  await this.fetchFeed(page, feed);
	  await page.goto(url);
	  
	  await page.waitForTimeout(timeout);
	 
	  await context.close();
	  
	  ret = true;
	
	}catch(err){
		console.log("err",err);
	}

	return 	ret;
  }

  async fetchFeedOnly(feed) {
	/*
	const browser = await chromium.launch({ headless: false, slowMo: 50 });
	  
	//new page
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(0); 
	  
    let ret =  await this.fetchFeed(page, feed);	

    await browser.close();
	*/
	//C:\Users\55381\AppData\Local\Google\Chrome\User Data
	//msedge, chrome, chromium
	let ret = false;
	try {
	 const context = await launchContext();
	 const page = context.pages()[0];	
	 //await page.setDefaultNavigationTimeout(0);
	 
	  ret =  await this.fetchFeed(page, feed);
	 
	await context.close();
	
	}catch(err){
		console.log("err",err);
	}

	return 	ret;
  } 
  
  /**
   * fetch Feed
   * 
   */
  async fetchFeed(page, feed) {
	try {

		let url = feed?.url || "";
		if(url == ""){
		  return false;
		}
		
		let config = this.getFeedConfig(feed) || {};
		let feedActions = config?.feedActions || [];
		let beforeGotoActions = [];
		let afterGotoActions = [];
		let afterParseActions = [];
		
		for(var i = 0; i < feedActions.length; i++){		  
		  let feedAction = feedActions[i];
		  let phase = feedAction?.phase || "";
		  if(phase == "beforeGoto"){
			beforeGotoActions.push(feedAction);  
		  }else if(phase == "afterGoto"){
			afterGotoActions.push(feedAction);  
		  }else if(phase == "afterParse"){
			afterParseActions.push(feedAction);   
		  }
		}
		
		let context = {
			page:page,
			feed:feed,
		}
		
		if(beforeGotoActions.length > 0){
		   await executeActions(beforeGotoActions, context);	
		}
		//await page.waitForTimeout(5000);
		//访问url
		await page.goto(url);
		
		if(afterGotoActions.length > 0){
		   await executeActions(afterGotoActions, context);	
		}
		//await page.waitForTimeout(5000);
		
        await this.scrapeItems(page,feed);
		
        await this.scrapePagers(page, feed);
		
		
		if(afterParseActions.length > 0){
		   await executeActions(afterParseActions, context);	
		}		
		
		//设置下次运行的时间，时间间隔用的是分钟，
		let date = 	new Date();
	    let interval = feed?.interval  || 1440;
	    date.setMinutes(date.getMinutes() + interval);
		
		const updatefeed = await prisma.feed.update({
		  where: {
			id:feed?.id,
		  },
		  data: {
			fetchStatus: 1,
			nextTime:date,
		  },
		})		

        return true;		

	}catch (err) {
      //ctx.throw(422);
	  console.log("err", err);
	    //运行失败，更新抓取状态为 失败。
		const updatefeed = await prisma.feed.update({
		  where: {
			id:feed?.id,
		  },
		  data: {
			fetchStatus: 2,
		  },
		})

		let obj = {
			url : feed.url || '',
			id : feed.id || '',
		};
		
        await watchdog("feed", err + JSON.stringify(obj), 5, null);		
	  
      return false;
    }    
  }

  getFeedConfig(feed) {
	let config = {};
    if(feed?.useTemplate){
		config = feed?.template?.config || {}
	}else{
		config = feed?.config || {}
	}
    return	config;
  }

  async scrapeItems(page,feed) {
	let config  = this.getFeedConfig(feed) || {};
	let feedParser = config.feedParser || {};
	let selector = feedParser.selector  || "";
	//console.log("config", config);
	//console.log("selector", selector);
	if(selector == ""){
	  return;
	}

	var itemList = [];		

	// 查找并操作元素
	const listElements = await page.locator(selector);
	//const textContent = await element.textContent();
	//console.log(textContent);
	const count = await listElements.count();
	
	let fields = feedParser.fields || [];
	
	let disableScrapeItem = config?.itemParser?.disableScrapeItem || false;
	// console.log("count", count);	
	//console.log("fields", fields);
	//默认直接提取a链接，使用a 的title， url信息
	if(fields.length  == 0){
	
		for (let i = 0; i < count; ++i){
		  let ele = listElements.nth(i);
		 // let title = await ele.innerText();
		  //let url = await ele.getAttribute("href");
		  //使用evaluate可以直接获取到完整的url，  ele.getAttribute("href"); 智能获取到 /node/123,缺少域名，需要一次转换
		  let itemTmp = await ele.evaluate((element) => {
				return {
					url: element.href.trim(),
					title: element.innerText.substr(0,254)
				}			  
			});

		  itemList.push(itemTmp);
		
		}
	}else{
		
		let context = {
			page:page,
			feed:feed,
		}
		for (let i = 0; i < count; ++i){
		  let ele = listElements.nth(i);
		  let itemTmp = {};
          for(var j = 0; j < fields.length; j++){		  
			  let parserField = fields[j];
			  
			  let name = parserField['name'] || "";
			  let selector = parserField['selector'] || "";
			  let attribute = parserField['attribute'] || "innerText";
			  //console.log("name", name);
			  if(name != "" && selector == ""){
				  let field_value = null;
				  if(attribute == "innerText"){
					field_value = await ele.innerText();  
				  }else if (attribute == "innerHTML"){
					field_value = await ele.innerHTML();   
				  }else if (attribute == "textContent"){
					field_value = await ele.textContent();  
				  }else{
					field_value = await ele.getAttribute(attribute);  
				  }
				  //let field_value = await ele.getAttribute(attribute);
				  if(field_value != null){
					//支持转换
					field_value = await executeTransformer(field_value, parserField, context);
				    itemTmp[name] = field_value;
				  }				  
			  }
			  if(name != "" && selector != ""){
				  
				const field_ele = await ele.locator(selector);
				if(field_ele != null){
					
				  let field_value = null;
				  if(attribute == "innerText"){
					field_value = await field_ele.innerText();  
				  }else if (attribute == "innerHTML"){
					field_value = await field_ele.innerHTML();   
				  }else if (attribute == "textContent"){
					field_value = await field_ele.textContent();  
				  }else{
					field_value = await field_ele.getAttribute(attribute);  
				  }
				  //let field_value = await field_ele.getAttribute(attribute);
				  if(field_value != null){
					//支持转换
					field_value = await executeTransformer(field_value, parserField, context);		  
					itemTmp[name] = field_value;
				  }
				}

			  }
		  }
		  
		  let item_url =  itemTmp.url || "";
			// console.log("itemTmp", itemTmp);
			//if((article_title !=="") && (article_url !=="") ){
		  if((item_url !=="") ){
			  //我们总是构建一个有效的URL
			  /*
              if(!this.isValidUrl(item_url)){
				 item_url =  url + "#" + item_url;
				 item.url = item_url;
			  }
			  */
				
			  itemList.push(itemTmp);
		  }		  
		  
		}			  
	}
	
	//分成两个阶段，方便处理
	//console.log("ItemList", ItemList);
	for(var i = 0; i < itemList.length; i++)
	{
		let itemObj = itemList[i];
		
		let item = await prisma.item.findFirst({
		  where: {
			url: itemObj.url,
		  },
		})			
		
		//如果不存在，创建
		if (!item) {
		  //自动设置任务id
		  let itemTmp = {}
		  itemTmp.feedId = feed?.id;
		  //需要设置默认值，如果schema里面没有设置的话
		  //itemTmp.content = "";
		  //如果禁用了disableScrapeItem，则直接设置为已抓取1；否则设置为未抓取，后续会定时抓取
		  itemTmp.fetchStatus = disableScrapeItem ? 1 : 0;
		  //itemTmp.data = null;
		  itemTmp.url = itemObj.url;
		  itemTmp.title = itemObj.title || itemObj.url;
		  itemTmp.content = itemObj.content || "";
			//const obj = { a: 1, b: 2 };
		  let tempData = {};
		  let exitKeys = ["title", "url", "content"];
		  Object.keys(itemObj).forEach(key => {
			 //	console.log(key, obj[key]); // 输出键值对
			 //key 不在已有的字段中，我们存到data里面
			if (exitKeys.indexOf(key) === -1) {
			 tempData[key] = itemObj[key]
			}
		  });
		  itemTmp.data = tempData;
		  
		  
		  //存储到数据库中
		  item = await prisma.item.create({ data: itemTmp })
		}
				
	}	  
	  
  }
  
  //scrape pagers data (listpage)， 
  async scrapePagers(page,feed) {
    //let config  = feed?.config || {};
	let config = this.getFeedConfig(feed) || {};
	let pagination = config.pagination || {};
	let paginationType = pagination.type  || "";
	let paginationSelector = pagination.selector  || "";
	let feedId = feed.id || 0;
	
	
	if(paginationType != "selector" || paginationSelector == "" || feedId == 0){
		return;
	}
	
    var pagerList = [];		

	// 查找并操作元素
	const listElements = await page.locator(paginationSelector);
	//const textContent = await element.textContent();
	//console.log(textContent);
	const count = await listElements.count();
		
		
	for (let i = 0; i < count; ++i){
	  let ele = listElements.nth(i);
	 // let title = await ele.innerText();
	  let url = await ele.getAttribute("href");
	  //console.log("url", url);
	  //使用evaluate可以直接获取到完整的url，  ele.getAttribute("href"); 智能获取到 /node/123,缺少域名，需要一次转换
	  let itemTmp = await ele.evaluate((element) => {
			return {
				url: element.href.trim(),
				title: element.innerText.substr(0,254)
			}			  
		});

	  pagerList.push(itemTmp);
	  //console.log("itemTmp", itemTmp);
		
	}
		
	//分成两个阶段，方便处理
	//console.log("ItemList", ItemList);
	for(var i = 0; i < pagerList.length; i++)
	{
		let pagerObj = pagerList[i];
		
		let listpage = await prisma.listpage.findFirst({
		  where: {
			url: pagerObj.url,
		  },
		})

		//console.log(listpage); 
		//如果不存在，创建一个新的分页链接
		if (!listpage) {
			listpage = await prisma.listpage.create({ data: {url:pagerObj.url,feedId:feedId, fetchStatus:0} })
		}			
						
	}	
		
  }	
  
  
  async fetchListPageOnly(listpage) {

	const context = await launchContext();
	const page = context.pages()[0];
	  
    let ret = await this.fetchListPage(page, listpage);	

    await browser.close();
    return ret;	
  }  

  /**
   * fetch List Page
   * 
   */
  async fetchListPage(page, listpage) {
	try {

		let feed = listpage?.feed || {};
		
		//console.log("feed", feed);
		
		let url = listpage?.url || "";
		if(url == ""){
		  return false;
		}
		
		await page.goto(url);
		
		/*
		//解析
		let selector = feed?.config?.feedParser?.selector  || "";
		
		if(selector == ""){
		  return false;
		}

        var ItemList = [];		

		// 查找并操作元素
		const listElements = await page.locator(selector);
		//const textContent = await element.textContent();
		//console.log(textContent);
		const count = await listElements.count();
		
		
		for (let i = 0; i < count; ++i){
		  let ele = listElements.nth(i);
		 // let title = await ele.innerText();
		  //let url = await ele.getAttribute("href");
		  //使用evaluate可以直接获取到完整的url，  ele.getAttribute("href"); 智能获取到 /node/123,缺少域名，需要一次转换
		  let itemTmp = await ele.evaluate((element) => {
				return {
					url: element.href.trim(),
					title: element.innerText.substr(0,254)
				}			  
			});

		  ItemList.push(itemTmp);
		
		}
		
		//分成两个阶段，方便处理
		console.log("ItemList", ItemList);
		for(var i = 0; i < ItemList.length; i++)
		{
			let itemObj = ItemList[i];
			
			let item = await prisma.item.findFirst({
			  where: {
				url: itemObj.url,
			  },
			})			
			
			//如果不存在，创建
			if (!item) {
			  //自动设置任务id
			  itemObj.feedId = feed?.id;
			  //需要设置默认值，如果schema里面没有设置的话
			  itemObj.content = "";
			  itemObj.fetchStatus = 0;
			  itemObj.data = null;
			  //存储到数据库中
			  item = await prisma.item.create({ data: itemObj })
			}
					
		}
		*/
		
		await this.scrapeItems(page,feed);
		
        await this.scrapePagers(page, feed);

		const updateListpage = await prisma.listpage.update({
		  where: {
			id:listpage?.id,
		  },
		  data: {
			fetchStatus: 1,
		  },
		})		
	
		return true
		//return new Response.json(proxy);
	}catch (err) {
      //ctx.throw(422);
	  console.log("err", err);
		const updateListpage = await prisma.listpage.update({
		  where: {
			id:listpage?.id,
		  },
		  data: {
			fetchStatus: 2,
		  },
		})	

		let obj = {
			url : listpage?.url || '',
			id : listpage?.id || '',
		};
		
        await watchdog("feed", err + JSON.stringify(obj), 5, null);			
	  
	  return false
    }	

  }  
 

  async fetchItemOnly(item) {

	const context = await launchContext();
	const page = context.pages()[0];	
	await page.setDefaultNavigationTimeout(0);
	 
	let ret =  await this.fetchItem(page, item);

	 
	await context.close();	
    return	ret;
  }
  
  /**
   * fetch item
   * 
   */
  async fetchItem(page, item) {
	  
	try {

		//console.log("item", item);
		
		let url = item?.url || "";
		if(url == ""){
		  return false;
		}
		let feed = item?.feed || {};	

        let config = this.getFeedConfig(feed) || {};
		let itemActions = config?.itemActions || [];
		let beforeGotoActions = [];
		let afterGotoActions = [];
		let afterParseActions = [];
		
		for(var i = 0; i < itemActions.length; i++){		  
		  let itemAction = itemActions[i];
		  let phase = itemAction?.phase || "";
		  if(phase == "beforeGoto"){
			beforeGotoActions.push(itemAction);  
		  }else if(phase == "afterGoto"){
			afterGotoActions.push(itemAction);  
		  }else if(phase == "afterParse"){
			afterParseActions.push(itemAction);   
		  }
		}
		
		let context = {
			page:page,
			feed:feed,
		}		
		
		if(beforeGotoActions.length > 0){
		   await executeActions(beforeGotoActions, context);	
		}
		
		await page.goto(url);
		
		if(afterGotoActions.length > 0){
		   await executeActions(afterGotoActions, context);	
		}

        let disableAutoScrapeContent = 	config?.itemParser?.disableAutoScrapeContent || false;
		let downloadContentImg = 	config?.itemParser?.downloadContentImg || false;
		let articleContent = "";
		//如果没有禁用，就使用readability智能提取正文
		if(!disableAutoScrapeContent){
			const readabilityJsStr = fs.readFileSync('node_modules/@mozilla/readability/Readability.js', {encoding: 'utf-8'})

			articleContent = await page.evaluate(`
				(function(){
				  ${readabilityJsStr}

				  return new Readability({}, document).parse().content;
				}())
			  `);
			//如果为真，就自动下载正文图片，否则不下载
            if(downloadContentImg){
				articleContent = await this.downloadContentImgs(articleContent);
			}
		}		
	    let fields = config?.itemParser?.fields || [];
        let itemObj = {};
        
        for(var j = 0; j < fields.length; j++){		  
			let parserField = fields[j];
			  
			let name = parserField['name'] || "";
			let selector = parserField['selector'] || "";
			let attribute = parserField['attribute'] || "innerText";
			//  console.log("name", name);

			if(name != "" && selector != ""){
				  
				let  field_ele = await page.locator(selector);
				//console.log("field_ele", field_ele);

				if(field_ele != null){
					
				  let field_value = null;
				  if(attribute == "innerText"){
					field_value = await field_ele.innerText();  
				  }else if (attribute == "innerHTML"){
					field_value = await field_ele.innerHTML();   
				  }else if (attribute == "textContent"){
					field_value = await field_ele.textContent();  
				  }else{
					field_value = await field_ele.getAttribute(attribute);  
				  }
				  //let field_value = await field_ele.getAttribute(attribute);
				  if(field_value != null){
					 //transform
					field_value = await executeTransformer(field_value, parserField, context);
					itemObj[name] = field_value;
				  }
				}

			}
		}
		
		//增加item对象，允许动作修改item？
		context.item = itemObj;

		if(afterParseActions.length > 0){
		   await executeActions(afterParseActions, context);	
		}
		
		//增加对采集评论的支持，如果启用了采集评论，采集它；否则不用采集
		//评论存到了字段data的comments属性里面，
		context.config = config;	
		let scrapeComment = config?.commentParser?.scrapeComment || false;
	    if(scrapeComment){
	      itemObj["comments"] = await this.scrapeComments(context);
	    }		
		
		
		let exitKeys = ["title", "url", "content"];
		let tempObj = {};
		
		if(articleContent != ""){
		  tempObj.content = articleContent || '';
		}
		tempObj.fetchStatus =  1;
		
		//支持合并原来的属性，
		let oldData = item.data || {};
		//tempObj.data = item
		tempObj.data = {...oldData};
		Object.keys(itemObj).forEach(key => {
			 //	console.log(key, obj[key]); // 输出键值对
			 //key 不在已有的字段中，我们存到data里面
			if (exitKeys.indexOf(key) === -1) {
			  tempObj.data[key] = itemObj[key]
			}else{
			  tempObj[key] = itemObj[key]
			}
		});	

	

		const updateItem = await prisma.item.update({
		  where: {
			id: item?.id,
		  },
		  data: tempObj,
		})
        //console.log("article", articleContent);
		//await browser.close(); 		
		
		
		return true;
		//return new Response.json(proxy);
	}catch (err) {
      //ctx.throw(422);
	  console.log("err", err);
		const updateItem = await prisma.item.update({
		  where: {
			id: item?.id,
		  },
		  data: {
			fetchStatus: 2,
		  },
		})
		
        //写入日志,
		let obj = {
			url : item?.url || '',
			id : item?.id || '',
		};

        //console.log("obj", obj);		
        await watchdog("feed", err + JSON.stringify(obj), 5, null);			
	  
	  return new Response(null, { status: 500 })
    }	  
	  
  }
  
  
  //scrape pagers data (listpage)， 
  async scrapeComments(context) {
	let comments = [];
    let config  = context?.config || {};
	let page = context?.page || null;
	
	if(page == null){
		return comments;
	}
	
	let commentSelector = config?.commentParser?.commentSelector || "";
	console.log("commentSelector", commentSelector);
	if(commentSelector == ""){
		return comments;
	}
	
	let fields = config?.commentParser?.fields || [];
	//console.log("fields", fields);
	if(fields.length == 0){
		return comments;
	}
	
	let scrapeComment2 = config?.commentParser?.scrapeComment2 || false;

    //var pagerList = [];		
    console.log("scrapeComment2", scrapeComment2);
	// 查找并操作元素
	const listElements = await page.locator(commentSelector);
	//const textContent = await element.textContent();
	//console.log(textContent);
	const count = await listElements.count();
    console.log("listElements", listElements);
	 console.log("count", count);

	for (let i = 0; i < count; ++i){
	  let ele = listElements.nth(i);
	  let itemTmp = {};
	  for(var j = 0; j < fields.length; j++){		  
		  let parserField = fields[j];
		  
		  let name = parserField['name'] || "";
		  let selector = parserField['selector'] || "";
		  let attribute = parserField['attribute'] || "innerText";
		  //console.log("name", name);
		  if(name != "" && selector == ""){
			  let field_value = null;
			  if(attribute == "innerText"){
				field_value = await ele.innerText();  
			  }else if (attribute == "innerHTML"){
				field_value = await ele.innerHTML();   
			  }else if (attribute == "textContent"){
				field_value = await ele.textContent();  
			  }else{
				field_value = await ele.getAttribute(attribute);  
			  }
			  //let field_value = await ele.getAttribute(attribute);
			  if(field_value != null){
				//支持转换
				field_value = await executeTransformer(field_value, parserField, context);
				itemTmp[name] = field_value;
			  }				  
		  }
		  if(name != "" && selector != ""){
			  
			const field_ele = await ele.locator(selector);
			if(field_ele != null){
				
			  let field_value = null;
			  if(attribute == "innerText"){
				field_value = await field_ele.innerText();  
			  }else if (attribute == "innerHTML"){
				field_value = await field_ele.innerHTML();   
			  }else if (attribute == "textContent"){
				field_value = await field_ele.textContent();  
			  }else{
				field_value = await field_ele.getAttribute(attribute);  
			  }
			  //let field_value = await field_ele.getAttribute(attribute);
			  if(field_value != null){
				//支持转换
				field_value = await executeTransformer(field_value, parserField, context);		  
				itemTmp[name] = field_value;
			  }
			}

		  }
	  }
	  
	  if(scrapeComment2){
	    itemTmp["subcomments"] = await this.scrapeComment2(ele, context);
	  }
	  
	  comments.push(itemTmp);
	}		
		

	return comments;	
	
		
  }  
  
  async scrapeSubComments(commentEle, context) {
	let comments = [];
    let config  = context?.config || {};
	
	let commentSelector2 = config?.commentParser?.commentSelector2 || "";
	if(commentSelector2 == ""){
		return comments;
	}
	
	let fields2 = config?.commentParser?.fields2 || [];
	
	if(fields2.length == 0){
		return comments;
	}

    //var pagerList = [];		

	// 查找并操作元素
	const listElements = await commentEle.locator(commentSelector2);
	//const textContent = await element.textContent();
	//console.log(textContent);
	const count = await listElements.count();


	for (let i = 0; i < count; ++i){
	  let ele = listElements.nth(i);
	  let itemTmp = {};
	  for(var j = 0; j < fields2.length; j++){		  
		  let parserField = fields2[j];
		  
		  let name = parserField['name'] || "";
		  let selector = parserField['selector'] || "";
		  let attribute = parserField['attribute'] || "innerText";
		  //console.log("name", name);
		  if(name != "" && selector == ""){
			  let field_value = null;
			  if(attribute == "innerText"){
				field_value = await ele.innerText();  
			  }else if (attribute == "innerHTML"){
				field_value = await ele.innerHTML();   
			  }else if (attribute == "textContent"){
				field_value = await ele.textContent();  
			  }else{
				field_value = await ele.getAttribute(attribute);  
			  }
			  //let field_value = await ele.getAttribute(attribute);
			  if(field_value != null){
				//支持转换
				field_value = await executeTransformer(field_value, parserField, context);
				itemTmp[name] = field_value;
			  }				  
		  }
		  if(name != "" && selector != ""){
			  
			const field_ele = await ele.locator(selector);
			if(field_ele != null){
				
			  let field_value = null;
			  if(attribute == "innerText"){
				field_value = await field_ele.innerText();  
			  }else if (attribute == "innerHTML"){
				field_value = await field_ele.innerHTML();   
			  }else if (attribute == "textContent"){
				field_value = await field_ele.textContent();  
			  }else{
				field_value = await field_ele.getAttribute(attribute);  
			  }
			  //let field_value = await field_ele.getAttribute(attribute);
			  if(field_value != null){
				//支持转换
				field_value = await executeTransformer(field_value, parserField, context);		  
				itemTmp[name] = field_value;
			  }
			}

		  }
	  }
	  
	  comments.push(itemTmp);
	}		
		

	return comments;	
	
		
  }    

  async downloadContentImgs(htmlContent) {
    const __filename = fileURLToPath(import.meta.url);
    const rootDir = path.dirname(__filename);	  
	//console.log("rootDir", rootDir);
	//rootDir D:\nodejs\nextcrawler\.next\lib	  
	//let baseUrl = "http://localhost:3000";
	  
    let year = moment().format('YYYY');
	let month = moment().format('MM');
	let date = moment().format('DD');
	  
	let staticPath = `../../public/file/images/${year}/${month}/${date}`;
		//make sure dir exist
	let dirpath = path.join( rootDir, staticPath);
	if(!fs.existsSync(dirpath)){
		fs.mkdirSync(dirpath, { recursive: true });
	}
    //console.log("dirpath", dirpath);	
	  
    const $ = await cheerio.load(htmlContent);	
	let imgs = $('img');
	for(var i = 0; i < imgs.length; i++){
		let img = imgs[i];
		 //console.log("img", img);
		 let imgUrl = $(img).attr("src");
		 //console.log("imgUrl", imgUrl);
		var pattern = /^((http|https|ftp):\/\/)/;

        if(pattern.test(imgUrl)) {

		  //可以工作的版本，非常漂亮，

		  
			try {
				//console.log("imgUrl", imgUrl);
				const response = await fetch(imgUrl);
				//console.log("response", response);
				if (response.ok) {
                    let arrayBuffer = await response.arrayBuffer();
					let buffer = Buffer.from(arrayBuffer);
				    let fileType = await fileTypeFromBuffer(buffer);
					//console.log("fileType", fileType);
					let fileExt = fileType.ext || "jpg";
					let fileName = uuidv4();
					//console.log("fileName", fileName);
				    await fs.promises.writeFile(`${dirpath}/${fileName}.${fileExt}`, buffer, 'binary');			
				    //let imgUrlNew = baseUrl +  `/file/images/${year}/${month}/${date}/${fileName}.${fileExt}`;
					let imgUrlNew = `/file/images/${year}/${month}/${date}/${fileName}.${fileExt}`;
				    $(img).attr("src", imgUrlNew);					
				}
				
				//return buffer;
			} catch (error) {
				console.error('Error fetching data:', error);
			}
         
		}
	 }

    let ret = $('body').html() || htmlContent;
    return ret;
	  
  }	  
  
   /**
   * fetch Detail Page
   * 
   */
  async generateListPage(feed) {

//分页的json数据结构：
/*
		pagination:{
		  type:"pattern" " "selector"
		  pattern:,
          initial:,
		  increment:,
		  num:this.,
		  
		},			  
*/	
    let config = this.getFeedConfig(feed) || {};  
	let paginationConfig = config?.pagination || {};
	
	let pattern = paginationConfig.pattern || "";
	let initial = parseInt(paginationConfig.initial) || 0;
	let increment = parseInt(paginationConfig.increment) || 1;
	let num = parseInt(paginationConfig.num) || 0;
	
	//如果数据为空，返回，
	if(pattern == "" || num ==0){
		return;
	}
	let index = initial;
	//let incrementInt = parseInt(incrementInt);
	//let numInt = parseInt(num);
	
	let feedUrl = feed?.url || "";
	for(var i = 0; i < num; i++)
	{
		
		let url = pattern.replace("$index", index.toString());
		url = url.replace("$feedUrl", feedUrl);
		//var listPage = await ListPage.findOne({ url: url});
		let listpage = await prisma.listpage.findFirst({
		  where: {
			url: url,
		  },
		})

		//console.log(listpage); 
		//如果不存在，创建一个新的分页链接
		if (!listpage) {
            listpage = await prisma.listpage.create({ data: {url:url,feedId:feed?.id, fetchStatus:0} })
		}

        index = index + increment;		
    }
	  
  }


  /**
   * Get pending sync items，
   * 
   */
  async getPendingSyncItems(limitNum) {
    //item默认只抓取一次，但是可以修改这里的代码，进行调度
	let filters = {
		take: limitNum, // Limit to page size
		where: {
		  synced:false,   //未同步的
		  fetchStatus: 1, //抓取状态等于1
		  //nextTime: {
			//lte: new Date(), //下次运行时间小于当前时间
		  //},
		},
	};
	
	const items = await prisma.item.findMany(filters);
	
    return items;  
  } 
  
  async getRandomProxy() {
	  
    let proxies = await prisma.$queryRaw`SELECT * FROM proxy WHERE status=TRUE ORDER BY RAND() LIMIT 1`;
	//console.log("proxies", proxies);
	if(proxies.length > 0){
	  return proxies[0]
	}else{
	  return null;
	}
  } 

  /**
   * sync item to your prodction site，同步到发布平台，示例代码，用的时候请求改
   * 
   */
  syncItemToProduction(item) {
	const  dataURL = 'https://www.example.com/private/syncitem';

	fetch(dataURL, {
		method: "POST", 
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
	.then((response) => response.json()) 
	.then((data) => {
		console.log("Success:", data); 
	})
	.catch((error) => {
		console.error("Error:", error);
	});	  
  }
  
}


export default new FeedService();
