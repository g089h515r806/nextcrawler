import child_process from 'child_process';
//import events from 'events';

class YtdlpDownloader {

  constructor(downloadDir) {
    this.downloadDir = downloadDir;
    this.isBusy = false;
    this.downloaderProcess = null;
  }
   
  downloadVideo(url, options, maxTime) { 

	this.downloaderProcess = child_process.spawn('yt-dlp', [url], {cwd: this.downloadDir});
	
 	this.downloaderProcess.stdout.setMaxListeners(0);
	this.downloaderProcess.stderr.setMaxListeners(0);
	this.downloaderProcess.setMaxListeners(0);
	
	const myPromise = new Promise((resolve, reject) => {
		//let maxTime = this.moveTime+1500;
	// 设置一个定时器
		let timerId = setTimeout(function() {
			//engine_pro.stdin.write("quit\n");
			this.isBusy = false;
			//eventEmitter.emit("failed", {message:"engine time out"});
			reject({errorCode:"01", message:"download Video time out"});
		  //console.log("这个消息将在2秒后显示");
		}, maxTime);
		
		// 异步操作
		  
		//let uciInfos = [];
		this.downloaderProcess.stdout.on('data', (data) => {
		  
		  let data_str = data.toString();
		  console.log('data_str', data_str);

		  //let i = data_str.indexOf("Valid downloads");
		  let i = data_str.indexOf("pass -k to keep");
		  console.log('i', i);
		  //let move = "";
		  if(i !== -1){
			//setTimeout(function() {
				//engine_pro.stdin.write("quit\n");

			//}, 100);
			
			  this.isBusy = false;
			  clearTimeout(timerId);			
              resolve({errorCode:"0",message:"success"});

		  }  

		}); 
        //videodl的结束字符串，出现在了stderr里面，
        this.downloaderProcess.stderr.on('data', (data) => {
          console.error(` download error: ${data}`);

        });

        this.downloaderProcess.on('close', (code) => {
          console.log(`download end，close code: ${code}`);
        });		
	 
	});

    return myPromise;
  } 

  isBusy() { 
     return this.isBusy;
  } 

  exit() { 
    if(this.downloaderProcess){
      this.downloaderProcess.kill();
    }
  }   

  /* eslint-enable no-param-reassign */
}


export default YtdlpDownloader;
