import prisma from '@/lib/prisma';

export async function GET(request,{ params }) {
	try {
		const { id } = await params
		const item = await prisma.item.findUnique({
		  where: {
			id: parseInt(id),
		  },
		})
		//console.log("item", item);
		
		return new Response(JSON.stringify(item), { status: 200 })
		//return new Response.json(proxy);
	}catch (err) {
      //ctx.throw(422);
	  return new Response(null, { status: 500 })
    }
  //const res = await request.json()
  
}


export async function PATCH(request, { params }) {
  try {
	  const itemObject = await request.json();
	  const { id } = await params;
	  
	  //let label = proxyObject.label || '';
	  //let url = proxyObject.url || '';
	  //let status = proxyObject.status || false;
	  if(id != ''){
		const updateItem = await prisma.item.update({
		  where: {
			id: parseInt(id),
		  },
		  data: {
			title: itemObject.title || '',
			url: itemObject.url || '',
			content: itemObject.content || '',
			data: itemObject.data || null,
			fetchStatus: parseInt(itemObject.fetchStatus) || 0,
			synced: itemObject.synced || false,
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


export async function DELETE(request, { params }) {
  try {
	  //const proxyObject = await request.json();
	  const { id } = await params;
	 
	  if(id != ''){
		const updateItem = await prisma.item.delete({
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