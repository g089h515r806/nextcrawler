import prisma from '@/lib/prisma';

export async function GET(request) {
  //const res = await request.json()
  return Response.json({ "test":"test" })
}

export async function POST(request) {
  try {
	  const proxyObject = await request.json()
	  
	  const proxy = await prisma.proxy.create({ data: proxyObject })
	  //https://www.prisma.io/docs/orm/prisma-client/queries/crud
	  
	  //return Response.json(proxy)
	  return new Response(null, { status: 204 })
  }catch (err) {
      //ctx.throw(422);
	  return new Response(null, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
	  const proxyObject = await request.json();
	  
	  let id = proxyObject.id || '';
	  let label = proxyObject.label || '';
	  let url = proxyObject.url || '';
	  if(id != ''){
		const updateProxy = await prisma.proxy.update({
		  where: {
			id: id,
		  },
		  data: {
			label: proxyObject.label || '',
			url: proxyObject.url || '',
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