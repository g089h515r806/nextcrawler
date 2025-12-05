import { chromium } from 'playwright';
import prisma from './prisma.js';

export default async function launchContext(config) {
  let launchOption = {};
  //console.log("config",config);  
  if(config == null){
	config = await prisma.config.findFirst({
	  where: {
		key: "system",
	  },
	})	  
  }
  
  //console.log("config",config);
  
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
	
  let usePersistentContext = config?.value?.usePersistentContext || false;
	
  let userDataDir = config?.value?.userDataDir || "";
  let headless = config?.value?.headless || false;
  let channel = config?.value?.channel || "";
  
  //launchOption.userDataDir = userDataDir;
  launchOption.headless = headless;
  launchOption.channel = channel;
  
  //console.log("launchOption",launchOption);
  
  //userDataDir = "D:\\chrome\\userdata";
  let context = null;
  try{
    if(usePersistentContext == true){
	  //console.log("launchOption1",launchOption);
      context = await chromium.launchPersistentContext(userDataDir, launchOption);
	  //console.log("launchOption2",launchOption);
    }else{
      const browser = await chromium.launch(launchOption);
      context = await browser.newContext();	
	  //持久化会自动创建一个page，为了方便，这里先创建一个，统一后面的代码
      const page = await context.newPage();	  
    }
  }catch(err){
	console.log("err",err);  
  }
	
  return context;
}
