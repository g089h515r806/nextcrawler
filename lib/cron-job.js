import { chromium } from 'playwright';
//import { chromium } from 'playwright-extra';
//import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import prisma from './prisma.js';
import FeedService from './feed-service.js';

export default async function runCronJob() {
	// 可以使用stealth 增强用户真实性
	//chromium.use(stealthPlugin());
	let launchOption = {};
	let config = await prisma.config.findFirst({
	  where: {
		key: "system",
	  },
	})
	//console.log("config", config);
	//如果用户没有开启定时采集任务，直接返回
	let useCronJob = config?.value?.useCronJob || false;
	if(!useCronJob){
		return;
	}
	//增加代理支持
    let useProxy = config?.value?.useProxy || false;
	//console.log("useProxy", ""+useProxy);
	if(useProxy){
		let proxy = await FeedService.getRandomProxy();
		//console.log("proxy", proxy);
		let server = proxy?.server || "";
		if(server != ""){
			launchOption.proxy = {
				server: server,
				username: proxy.username || "",
				password: proxy.password || "",
			}
			
			//console.log("launchOption", launchOption);
		}
	}
	const browser = await chromium.launch(launchOption);
	const page = await browser.newPage();

	
	
	//console.log("config", config);
	let limitNumFeed = parseInt(config?.value?.limitNumFeed) || 2;
	let limitNumListPage = parseInt(config?.value?.limitNumListPage) || 2;
	let limitNumItem = parseInt(config?.value?.limitNumItem) || 5;
	
	//console.log("limitNumItem", ""+limitNumItem);
	
	let feeds = await FeedService.getPendingFeeds(limitNumFeed);
	
	//console.log("feedslength", ""+feeds.length);
	for(var i = 0; i < feeds.length; i++){
		 await FeedService.fetchFeed(page, feeds[i]);
	}
	


	let listPages = await FeedService.getPendingListPages(limitNumListPage);
	for(var i = 0; i < listPages.length; i++){
		 await FeedService.fetchListPage(page, listPages[i]);
	}


	
	let items = await FeedService.getPendingItems(limitNumItem);
	for(var i = 0; i < items.length; i++){
		 await FeedService.fetchItem(page, items[i]);
	}	
	
	
	await browser.close(); 		
}
