import prisma from '@/lib/prisma';

export async function GET(reques,{ params }) {
	try {
		const { id } = await params
		const proxy = await prisma.proxy.findUnique({
		  where: {
			id: parseInt(id),
		  },
		})
		//console.log("proxy", proxy);
		
		return new Response(JSON.stringify(proxy), { status: 200 })
		//return new Response.json(proxy);
	}catch (err) {
      //ctx.throw(422);
	  return new Response(null, { status: 500 })
    }
  //const res = await request.json()
  
}


export async function PATCH(request,{ params }) {
  try {
	  const proxyObject = await request.json();
	  const { id } = await params;
	  
	  //let label = proxyObject.label || '';
	  //let url = proxyObject.url || '';
	  //let status = proxyObject.status || false;
	  if(id != ''){
		const updateProxy = await prisma.proxy.update({
		  where: {
			id: parseInt(id),
		  },
		  data: {
			label: proxyObject.label || '',
			server: proxyObject.server || '',
			username: proxyObject.username || '',
			password: proxyObject.password || '',
			status: proxyObject.status || false,
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


export async function DELETE(request, { params }) {
  try {
	  //const proxyObject = await request.json();
	  const { id } = await params;
	 
	  if(id != ''){
		const updateProxy = await prisma.proxy.delete({
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