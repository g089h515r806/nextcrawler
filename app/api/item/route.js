import prisma from '@/lib/prisma';



export async function POST(request) {
  try {
	  const itemObject = await request.json()
	  
	  itemObject.data = null
	  
	  const item = await prisma.item.create({ data: itemObject })
	  //https://www.prisma.io/docs/orm/prisma-client/queries/crud
	  
	  //return Response.json(proxy)
	  return new Response(null, { status: 204 })
  }catch (err) {
  console.log("err", err);
      //ctx.throw(422);
	  return new Response(null, { status: 500 })
  }
}
