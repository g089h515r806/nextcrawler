//import { chromium } from 'playwright';
//import playwright from 'playwright-core';

//import { chromium } from 'playwright-extra'
//import StealthPlugin from 'puppeteer-extra-plugin-stealth'
//import { chromium } from 'playwright-extra';
//import stealthPlugin from 'puppeteer-extra-plugin-stealth';

import  testFetch  from "@/lib/testlib"

export async function GET(request) {
	
  try{
    await testFetch();
	return new Response({ "title":"success" }, { status: 200 })
  }catch (err) {
	console.log("err", err);
	return new Response({ "title":"error" }, { status: 500 })
  } 	
  //const res = await request.json()
  /*
    //chromium.use(stealthPlugin());
	const browser = await chromium.launch({ headless: true });
	const page = await browser.newPage();
	
	await page.goto('https://bot.sannysoft.com', { waitUntil: 'networkidle' })
    await page.screenshot({ path: 'stealth.png', fullPage: true })
	
	//await page.goto('https://www.cnki.net/');
	//await page.waitForTimeout(5000);
	
	*/
	/*
	await page.goto('https://www.thinkindrupal.com/node');

	// 查找并操作元素
	//const element = await page.$('h1.title');
	//const textContent = await element?.textContent();
	//console.log(textContent);
	let selector ="#block-system-main article"
	const listElements = await page.locator(selector);
	
	const count = await listElements.count();
	
	//Locator
	//innerText,innerHTML,textContent
	//getAttribute
	for (let i = 0; i < count; ++i){
	  let ele = listElements.nth(i);
	  const h2 = await ele.locator('//h2');
	  
	  //innerText(), textContent, 
	  const title = await h2?.innerText();
	  
	  console.log("title", title);
	  const footer = await ele.locator('footer');
	  
	  const fclass = await footer.getAttribute("class");
	  
	  console.log("fclass", fclass);
	  
	  const alink = await ele.locator('h2 a');
	  const href = await alink.getAttribute("href");
	  
	  console.log("href", href);
	  
    }
*/	

 //	await browser.close();  
  
  //return Response.json({ "title":"success" })
}

