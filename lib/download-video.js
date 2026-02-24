import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import {fileURLToPath} from 'url';
import prisma from './prisma.js';
import YtdlpDownloader from './yt-dlp-downloader.js';
import VideodlDownloader from './videodl-downloader.js';

export default async function downloadVideo(config, url) {
  let ret = "";
  let videoDownloadConfig = config.videoDownload || {};
  let command = videoDownloadConfig.command || "none";
  if(command == "none" || url == ""){
    return ret;
  }
  if(command == "yt-dlp"){
    ret = await ytdlpDownloadVideo(videoDownloadConfig, url);
  }else if(command == "videodl"){
    ret = await videodlDownloadVideo(videoDownloadConfig, url);
	console.log("ret", ret);
  }
  return ret;
}

async function ytdlpDownloadVideo(videoDownloadConfig, url) {
  //let downloadDir =  'D:\\nodejs\\nextcrawler1\\public\\video\\';
  let ret = "";
  let fileName = generateMd5Name(url);
  let downloadDir = getVideoDownloadTmpDir(fileName);
  //let downloadDirTmp = downloadDir + '\\' + fileName + '\\';
  let optionsStr = videoDownloadConfig.options || "";
  let options = optionsStr.split(" ") || [];
  let maxTime = parseInt(videoDownloadConfig.maxTime) || 15000;

  let videodlDownloader = new YtdlpDownloader(downloadDir);
  let result = await videodlDownloader.downloadVideo(url, options, maxTime);
  console.log("result",result);
  videodlDownloader.exit();
  
  let files = getMp4FilesInDir(downloadDir);
  //我们假定只有一个mp4文件时，才会正确，
  if(files.length == 1){
    let destDirObj = getDestDir();
    let newPath = destDirObj.absDir + fileName + ".mp4";
    let relPath = destDirObj.relDir + fileName + ".mp4";
    let mp4File = files[0];
	
    try {
      // 同步重命名文件
      fs.renameSync(mp4File, newPath);
      console.log("文件重命名成功！");
	  //removeTmpDir(downloadDir); 
      ret = relPath;	
    } catch (err) {
      console.error("重命名失败:", err);
	  //removeTmpDir(downloadDir); 
      ret = "";
    }

  }else{
	ret = "";
  }
  
  removeTmpDir(downloadDir); 
  return ret;
}

async function videodlDownloadVideo(videoDownloadConfig, url) {
  let ret = "";
  let fileName = generateMd5Name(url);
  let downloadDir = getVideoDownloadTmpDir(fileName);
  //let downloadDirTmp = downloadDir + '\\' + fileName + '\\';
  //console.log("downloadDirTmp", downloadDirTmp);
  
  let optionsStr = videoDownloadConfig.options || "";
  let options = optionsStr.split(" ") || [];
  let maxTime = parseInt(videoDownloadConfig.maxTime) || 15000;
  console.log("maxTime", maxTime);
  

  let videodlDownloader = new VideodlDownloader(downloadDir);
  let result = await videodlDownloader.downloadVideo(url, options, maxTime);
  console.log("result",result);
  videodlDownloader.exit();

  let files = getMp4FilesInDir(downloadDir);
  console.log("files", files);
  //我们假定只有一个mp4文件时，才会正确，
  if(files.length == 1){
    let destDirObj = getDestDir();
    let newPath = destDirObj.absDir + fileName + ".mp4";
    let relPath = destDirObj.relDir + fileName + ".mp4";
    let mp4File = files[0];
	
    try {
      // 同步重命名文件
      fs.renameSync(mp4File, newPath);
      console.log("文件重命名成功！");
	  //removeTmpDir(downloadDir); 
      ret = relPath;	
    } catch (err) {
      console.error("重命名失败:", err);
	  //removeTmpDir(downloadDir); 
      ret = "";
    }

  }else{
	ret = "";
  }
  
  removeTmpDir(downloadDir); 
  return ret;
}

function generateMd5Name(url) {
  const hash_md5 = crypto.createHash("md5")
  hash_md5.update(url);
  let ret = hash_md5.digest("hex");
  return ret;
}

function getMp4FilesInDir(dir) {
  const result = [];
  const items = fs.readdirSync(dir);
  //items.forEach(item => {
  //var i;
  for (var i = 0; i < items.length; i++) { 
    let item = items[i];
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      let childResult = getMp4FilesInDir(itemPath);
	  console.log("childResult", childResult);	  
       //result.concat(childResult);
	   result.push(...childResult);
    } else {
      let extname = path.extname(item).toLowerCase();
	  console.log("extname", extname);
	  console.log("item", item);
      if(extname == ".mp4"){
	    console.log("extname1", extname);
        result.push(itemPath);
	  }

    }
  }
  
  console.log("result1", result);  
  return result;
}


function removeTmpDir(tmpDir) {
  fs.rm(tmpDir, { recursive: true, force: true }, (err) => {
    if (err) {
      console.log('err', err);
    }
    console.log('Directory and its contents deleted');
  });
}

function getDestDir() {
  const __filename = fileURLToPath(import.meta.url);
  const rootDir = path.dirname(__filename);
  //console.log("rootDir", rootDir);
  //rootDir D:\nodejs\nextcrawler\.next\lib

  let year = moment().format('YYYY');
  let month = moment().format('MM');
  let date = moment().format('DD');
	  
  let staticPath = `../../public/file/download/${year}/${month}/${date}/`;
  //make sure dir exist
  let dirpath = path.join( rootDir, staticPath);
  let relativePath = `/file/download/${year}/${month}/${date}/`;
  if(!fs.existsSync(dirpath)){
    fs.mkdirSync(dirpath, { recursive: true });
  }
  return {absDir:dirpath, relDir:relativePath};
}

function getVideoDownloadTmpDir(fileName) {
  const __filename = fileURLToPath(import.meta.url);
  const rootDir = path.dirname(__filename);
 
  let staticPath = `../../public/videotmp/${fileName}`;
  //make sure dir exist
  let dirpath = path.join( rootDir, staticPath);
  if(!fs.existsSync(dirpath)){
    fs.mkdirSync(dirpath, { recursive: true });
  }
  return dirpath;
}

/*
fs.rename(oldPath, newPath, (err) => {
if (err) throw err;
console.log(`Renamed to ${newPath}`);
});

const targetFiles = files.filter(file => {
    return path.extname(file).toLowerCase() === EXTENSION;
});

*/