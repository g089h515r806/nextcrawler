import prisma from '@/lib/prisma';



export async function POST(request) {
  try {
	  const feedObject = await request.json()
	  
	  //feedObject.config = null
	  
	  feedObject.tcode = feedObject.tcode || null;
	  
	  const feed = await prisma.feed.create({ data: feedObject })
	  //https://www.prisma.io/docs/orm/prisma-client/queries/crud
	  
	  //return Response.json(proxy)
	  return new Response(null, { status: 204 })
  }catch (err) {
  console.log("err", err);
      //ctx.throw(422);
	  return new Response(null, { status: 500 })
  }
}
