//import playwright from 'playwright';
//import { chromium } from 'playwright-extra';
//import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import {fileURLToPath} from 'url';
//import path from 'path';
import fs from 'fs';
import path from 'path';
import {fileTypeFromBuffer} from 'file-type';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export default async function testFetch() {
	//let proxy = await FeedService.getPendingFeeds(limitNumFeed);
	/*
    chromium.use(stealthPlugin());
	const browser = await chromium.launch({ headless: true });
	const page = await browser.newPage();
	
	await page.goto('https://bot.sannysoft.com', { waitUntil: 'networkidle' })
    await page.screenshot({ path: 'stealth.png', fullPage: true })
	
	
	
	await browser.close(); 		
	*/
	
	/*
	let htmlContent = '<p>123</p>';
	htmlContent = htmlContent + '<p>abc</p>';
	htmlContent = htmlContent + '<img src="https://www.thinkindrupal.com/sites/default/files/images/yaiyuan_templates.jpg"/>';
	htmlContent = htmlContent + '<p>efd</p>';
	
	htmlContent = await downloadContentImgs(htmlContent);
	
	console.log("htmlContent",htmlContent);
	*/
	
	let videoUrl = "https://www.thinkindrupal.com/sites/default/files/videos/zuizaoqipu.mp4";
	
	let videoUrl2 = await executeDownloadTransformer(videoUrl,null,null);
	
	console.log("videoUrl",videoUrl);
	console.log("videoUrl2",videoUrl2);
}


async function executeDownloadTransformer(value, config, context) {
	let valueNew = "";
    const __filename = fileURLToPath(import.meta.url);
    const rootDir = path.dirname(__filename);
	console.log("rootDir", rootDir);
	//rootDir D:\nodejs\nextcrawler\.next\lib
 
	let baseUrl = "http://localhost:3000";
	  
	let year = moment().format('YYYY');
	let month = moment().format('MM');
	let date = moment().format('DD');
	  
	let staticPath = `../../public/file/download/${year}/${month}/${date}`;
		//make sure dir exist
	let dirpath = path.join( rootDir, staticPath);
	if(!fs.existsSync(dirpath)){
		fs.mkdirSync(dirpath, { recursive: true });
	}
	console.log("dirpath", dirpath);	
	  
	var pattern = /^((http|https|ftp):\/\/)/;

	if(pattern.test(value)) {

	  //可以工作的版本
		try {
			const response = await fetch(value);
			if (response.ok) {
				let arrayBuffer = await response.arrayBuffer();
				let buffer = Buffer.from(arrayBuffer);
				let fileType = await fileTypeFromBuffer(buffer);
				console.log("fileType", fileType);
				let fileExt = fileType.ext || "jpg";
				let fileName = uuidv4();
				await fs.promises.writeFile(`${dirpath}/${fileName}.${fileExt}`, buffer, 'binary');			
				valueNew = baseUrl +  `/file/download/${year}/${month}/${date}/${fileName}.${fileExt}`;
				//$(img).attr("src", imgUrlNew);					
			}
			
			//return buffer;
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	 

	}
	
	if(valueNew != ""){
		return valueNew;
	}else{
		return value;
	}
}


async function downloadContentImgs(htmlContent) {
    const __filename = fileURLToPath(import.meta.url);
    const rootDir = path.dirname(__filename);
	console.log("rootDir", rootDir);
	//rootDir D:\nodejs\nextcrawler\.next\lib
 
	let baseUrl = "http://localhost:3000";
	  
	let year = moment().format('YYYY');
	let month = moment().format('MM');
	let date = moment().format('DD');
	  
	let staticPath = `../../public/file/images/${year}/${month}/${date}`;
		//make sure dir exist
	let dirpath = path.join( rootDir, staticPath);
	if(!fs.existsSync(dirpath)){
		fs.mkdirSync(dirpath, { recursive: true });
	}
	console.log("dirpath", dirpath);	
	  
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
				const response = await fetch(imgUrl);
				if (response.ok) {
					let arrayBuffer = await response.arrayBuffer();
					let buffer = Buffer.from(arrayBuffer);
					let fileType = await fileTypeFromBuffer(buffer);
					console.log("fileType", fileType);
					let fileExt = fileType.ext || "jpg";
					let fileName = uuidv4();
					await fs.promises.writeFile(`${dirpath}/${fileName}.${fileExt}`, buffer, 'binary');			
					let imgUrlNew = baseUrl +  `/file/images/${year}/${month}/${date}/${fileName}.${fileExt}`;
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
