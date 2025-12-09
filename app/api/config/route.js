import prisma from '@/lib/prisma';
//import { checkAuthorization } from '@/lib/session';

export async function GET(request) {
  try {
	  
	//let authed = await checkAuthorization();
	//if(!authed){
	//  return new Response(null, { status: 500 })
	//}
	//const configObject = await request.json()
	const searchParams = request.nextUrl.searchParams;
	let key = searchParams.get('key') || "";
	//let key = "system";
	if(key == ""){
	  return new Response(null, { status: 500 })
	}
		
	let config = await prisma.config.findFirst({
	  where: {
		key: key,
	  },
	})
	return new Response(JSON.stringify(config), { status: 200 })
  }catch (err) {
    console.log("err", err);
    //ctx.throw(422);
	return new Response(null, { status: 500 })
  }
}


export async function POST(request) {
  try {
	  const configObject = await request.json()
	    let key = configObject.key || "";
		if(key == ""){
		  return new Response(null, { status: 500 })
		}
		
		let value = configObject.value || {};
		
		let config = await prisma.config.findFirst({
		  where: {
			key: key,
		  },
		})			
		
		//如果不存在，创建
		if (!config) {
		  //存储到数据库中
		  config = await prisma.config.create({ data: {key:key, value:value} })
		}else{
			const updateConfig = await prisma.config.update({
			  where: {
				key:key,
			  },
			  data: {
				value: value,
			  },
			})		
		}
	  
	  //const feed = await prisma.feed.create({ data: feedObject })
	  //https://www.prisma.io/docs/orm/prisma-client/queries/crud
	  
	  //return Response.json(proxy)
	  return new Response(null, { status: 204 })
  }catch (err) {
  console.log("err", err);
      //ctx.throw(422);
	  return new Response(null, { status: 500 })
  }
}
