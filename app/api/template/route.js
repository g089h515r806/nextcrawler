import prisma from '@/lib/prisma';



export async function POST(request) {
  try {
	  const templateObject = await request.json()
	  
		let template = await prisma.template.findFirst({
		  where: {
			code: templateObject.code || "",
		  },
		})

		//console.log(listpage); 
		//如果不存在，创建一个新的分页链接
		if (!template) {
			template = await prisma.template.create({ data: templateObject })
		}else{
			return new Response(null, { status: 500 })
		}
	  //https://www.prisma.io/docs/orm/prisma-client/queries/crud
	  
	  //return Response.json(proxy)
	  return new Response(null, { status: 204 })
  }catch (err) {
    console.log("err", err);
      //ctx.throw(422);
	return new Response(null, { status: 500 })
  }
}
