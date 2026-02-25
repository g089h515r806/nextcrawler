import url from 'url';
import {fileURLToPath} from 'url';
//import path from 'path';
import fs from 'fs';
import path from 'path';
import {fileTypeFromBuffer} from 'file-type';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

export default async function executeTransformer(value, config, context) {
  let transformer = config?.transformer || "";
  if(transformer == ""){
	return value;
  }
  
  switch (transformer) {
	case 'trim':
	  return await executeTrimTransformer(value, config, context); 
	  break;
	case 'prefix':
	  return await executePrefixTransformer(value, config, context); 
	  break;
	case 'suffix':
	  return await executeSuffixTransformer(value, config, context); 
	  break;
	case 'absoluteUrl':
	  return await executeAbsoluteUrlTransformer(value, config, context); 
	  break;
    //Todo
	case 'download':
	  return await executeDownloadTransformer(value, config, context); 
	  break;
	case 'replaceToEmpty':
	  return await executeReplaceToEmptyTransformer(value, config, context); 
	  break;
	case 'downloadInnerImg':
	  return await executeDownloadInnerImgTransformer(value, config, context); 
	  break;
	case 'substr':
	  return await executeSubstrTransformer(value, config, context); 
	  break; 
	default:
		//	
  }
}


async function executeTrimTransformer(value, config, context) {
  return trim(value);
}

async function executePrefixTransformer(value, config, context) {
  let transformerArg = config.transformerArg || "";
  
  return transformerArg + value;
}

async function executeSuffixTransformer(value, config, context) {
  let transformerArg = config.transformerArg || "";
  
  return value + transformerArg;
}

async function executeAbsoluteUrlTransformer(value, config, context) {
  //npm i url
  let currentUrl = context?.page?.url() || "";
  return await url.resolve(currentUrl, value);
  //return value + transformerArg;
}

//TODO Download
//根据远程的url, 获取大到对应文件，保存到系统，返回本地路径，替换远程路径
// todo ，支持相对路径？
async function executeDownloadTransformer(value, config, context) {
	let valueNew = "";
    var pattern = /^((http|https|ftp):\/\/)/;
	
	if(!pattern.test(value)) {
		//是否需要？
		let currentUrl = context?.page?.url() || "";
		value = await url.resolve(currentUrl, value);	
	}
	
    //const __filename = fileURLToPath(import.meta.url);
    //const rootDir = path.dirname(__filename);
    const rootDir = process.cwd();
	//console.log("rootDir", rootDir);
	//rootDir D:\nodejs\nextcrawler\.next\lib
 
	//let baseUrl = "http://localhost:3000";
	  
	let year = moment().format('YYYY');
	let month = moment().format('MM');
	let date = moment().format('DD');
	  
	let staticPath = `public/file/download/${year}/${month}/${date}`;
		//make sure dir exist
	let dirpath = path.join( rootDir, staticPath);
	if(!fs.existsSync(dirpath)){
		fs.mkdirSync(dirpath, { recursive: true });
	}
	//console.log("dirpath", dirpath);	
	  
	

	if(pattern.test(value)) {

	  //可以工作的版本
		try {
			const response = await fetch(value);
			if (response.ok) {
				let arrayBuffer = await response.arrayBuffer();
				let buffer = Buffer.from(arrayBuffer);
				let fileType = await fileTypeFromBuffer(buffer);
				//console.log("fileType", fileType);
				let fileExt = fileType.ext || "jpg";
				let fileName = uuidv4();
				await fs.promises.writeFile(`${dirpath}/${fileName}.${fileExt}`, buffer, 'binary');			
				//valueNew = baseUrl +  `/file/download/${year}/${month}/${date}/${fileName}.${fileExt}`;
				valueNew = `/file/download/${year}/${month}/${date}/${fileName}.${fileExt}`;
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

async function executeReplaceToEmptyTransformer(value, config, context) {
  let transformerArg = config.transformerArg || "";
  //console.log("transformerArg", transformerArg);
  value = value.replace(transformerArg, "");
  //console.log("value", value);
  return value;
}

async function executeDownloadInnerImgTransformer(value, config, context) {

    //const __filename = fileURLToPath(import.meta.url);
    //const rootDir = path.dirname(__filename);
    const rootDir = process.cwd();	
	//console.log("rootDir", rootDir);
	//rootDir D:\nodejs\nextcrawler\.next\lib	  
	//let baseUrl = "http://localhost:3000";
	  
    let year = moment().format('YYYY');
	let month = moment().format('MM');
	let date = moment().format('DD');
	  
	let staticPath = `public/file/images/${year}/${month}/${date}`;
		//make sure dir exist
	let dirpath = path.join( rootDir, staticPath);
	if(!fs.existsSync(dirpath)){
		fs.mkdirSync(dirpath, { recursive: true });
	}
    //console.log("dirpath", dirpath);	
	  
    const $ = await cheerio.load(value);	
	let imgs = $('img');
	
	//当前路径，用于转绝对路径
	let currentUrl = context?.page?.url() || "";
	
	for(var i = 0; i < imgs.length; i++){
		let img = imgs[i];
		 //console.log("img", img);
		 let imgUrl = $(img).attr("src");
		 //console.log("imgUrl", imgUrl);
		var pattern = /^((http|https|ftp):\/\/)/;
		
		//尝试转为绝对路径
		if(!pattern.test(value)) {
			//是否需要？
			
			value = await url.resolve(currentUrl, value);	
		}		

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

async function executeSubstrTransformer(value, config, context) {
  let length = parseInt(config.transformerArg) || 0;
  if(length > 0){
    value = value.substr(0, length);
  }
  return value;
}


