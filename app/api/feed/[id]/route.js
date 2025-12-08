import prisma from '@/lib/prisma';
//import { checkAuthorization } from '@/lib/session';

export async function GET(request,{ params }) {
	try {
		//先检查是否有权限
		//let authed = await checkAuthorization();
		//if(!authed){
		//  return new Response(null, { status: 500 })
		//}		
		
		const { id } = await params
		const feed = await prisma.feed.findUnique({
		  where: {
			id: parseInt(id),
		  },
		  include: {
			template: true,
		  },		  
		})
		//console.log("feed", feed);
		
		return new Response(JSON.stringify(feed), { status: 200 })
		//return new Response.json(proxy);
	}catch (err) {
      //ctx.throw(422);
	  return new Response(null, { status: 500 })
    }
  //const res = await request.json()
  
}


export async function PATCH(request,{ params }) {
  try {
	  const feedObject = await request.json();
	  const { id } = await params;
	  //console.log("feedObject", feedObject);
	  //let label = proxyObject.label || '';
	  //let url = proxyObject.url || '';
	  //let status = proxyObject.status || false;
	  if(id != ''){
		const updatefeed = await prisma.feed.update({
		  where: {
			id: parseInt(id),
		  },
		  data: {
			label: feedObject.label || '',
			url: feedObject.url || '',
			interval: parseInt(feedObject.interval) || 0,
			fetchStatus: parseInt(feedObject.fetchStatus) || 0,
			grade: parseInt(feedObject.grade) || 2,
			useTemplate: feedObject.useTemplate || false,
			tcode: feedObject.tcode || null,
			config: feedObject.config || null,
		  },
		})
         return new Response(null, { status: 204 })		
	  }else{
	      return new Response(null, { status: 500 })
	  }
	  
	  //const proxy = await prisma.proxy.create({ data: proxyObject })
	  //https://www.prisma.io/docs/orm/prisma-client/queries/crud
	  
	  //return Response.json(proxy)
	 
  }catch (err) {
      //ctx.throw(422);
	  console.log("err", err);
	  return new Response(null, { status: 500 })
  }
}


export async function DELETE(request,{ params }) {
  try {
	  //const proxyObject = await request.json();
	  const { id } = await params;
	 
	  if(id != ''){
		const updateFeed = await prisma.feed.delete({
		  where: {
			id: parseInt(id),
		  },
		})
         return new Response(null, { status: 204 })		
	  }else{
	      return new Response(null, { status: 500 })
	  }
	  
	  //const proxy = await prisma.proxy.create({ data: proxyObject })
	  //https://www.prisma.io/docs/orm/prisma-client/queries/crud
	  
	  //return Response.json(proxy)
	 
  }catch (err) {
      //ctx.throw(422);
	  return new Response(null, { status: 500 })
  }
}