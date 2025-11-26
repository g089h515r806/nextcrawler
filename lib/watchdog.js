import prisma from './prisma.js';


export default async function watchdog(type, message, severity, req) {
    try {
	  //let name = "";
	  let location = "";
	  let hostname = "";
	  //ctx defined
	  if(req){
	    //let user = req.user || {};
	    //name = user.name || '匿名用户';
		location = req.url || "";
		hostname = req.headers['x-forwarded-for'] || "";
	  }

	  let logObject = {
		//username : name,
		type : type,
        message : message,
        severity : severity,
		location : location,
        hostname : hostname,
        referer:"",		
	  };
	  //console.log("logObject", logObject);	
	  const log = await prisma.watchdog.create({ data: logObject })
      //return true;
    } catch (err) {
		console.log("err", err);
      //return false;
    }		
	
}
