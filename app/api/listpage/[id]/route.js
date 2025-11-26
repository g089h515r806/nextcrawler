import prisma from '@/lib/prisma';

export async function GET(request,{ params }) {
	try {
		const { id } = await params
		const listpage = await prisma.listpage.findUnique({
		  where: {
			id: parseInt(id),
		  },
		})
		//console.log("listpage", listpage);
		
		return new Response(JSON.stringify(listpage), { status: 200 })
		//return new Response.json(proxy);
	}catch (err) {
      //ctx.throw(422);
	  return new Response(null, { status: 500 })
    }
  //const res = await request.json()
  
}


export async function PATCH(request,{ params }) {
  try {
	  const listpageObject = await request.json();
	  const { id } = await params;
	  
	  //let label = proxyObject.label || '';
	  //let url = proxyObject.url || '';
	  //let status = proxyObject.status || false;
	  if(id != ''){
		const updateListpage = await prisma.listpage.update({
		  where: {
			id: parseInt(id),
		  },
		  data: {
			url: listpageObject.url || '',
			interval:  parseInt(listpageObject.interval) || 0,
			fetchStatus: parseInt(listpageObject.fetchStatus) || 0,
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


export async function DELETE(request,  { params }) {
  try {
	  //const proxyObject = await request.json(); listpageObject
	  const { id } = await params;
	 
	  if(id != ''){
		const updateListpage = await prisma.listpage.delete({
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