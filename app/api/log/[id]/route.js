import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
	try {
		const { id } = await params
		const log = await prisma.watchdog.findUnique({
		  where: {
			id: parseInt(id),
		  },
		})
		//console.log("log", log);
		
		return new Response(JSON.stringify(log), { status: 200 })
		//return new Response.json(proxy);
	}catch (err) {
      //ctx.throw(422);
	  return new Response(null, { status: 500 })
    }
  //const res = await request.json()
  
}



export async function DELETE(request, { params }) {
  try {
	  //const proxyObject = await request.json();
	  const { id } = await params;
	 
	  if(id != ''){
		const updateLog = await prisma.watchdog.delete({
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