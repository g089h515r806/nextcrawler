import prisma from '@/lib/prisma';



export async function POST(request) {
  try {
	  const listpageObject = await request.json()
	  
	  //itemObject.data = null
	  
	  const listpage = await prisma.listpage.create({ data: listpageObject })
	  //https://www.prisma.io/docs/orm/prisma-client/queries/crud
	  
	  //return Response.json(proxy)
	  return new Response(null, { status: 204 })
  }catch (err) {
  console.log("err", err);
      //ctx.throw(422);
	  return new Response(null, { status: 500 })
  }
}
