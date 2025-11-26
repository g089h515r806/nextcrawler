import prisma from '@/lib/prisma';
import FeedService from '@/lib/feed-service';

export async function GET(request,{ params }) {
	try {
		const { id } = await params
		const item = await prisma.item.findUnique({
		  where: {
			id: parseInt(id),
		  },
		  include: {
			  feed: {
				include: {
					template: true,
				},				
			  },
		  },		  
		})
		console.log("item", item);
		
		let ret = await FeedService.fetchItemOnly(item);
		if(!ret){
		  return new Response(null, { status: 500 })
		}		
		
		return new Response(JSON.stringify(item), { status: 200 })
		//return new Response.json(proxy);
	}catch (err) {
      //ctx.throw(422);
	  console.log("err", err);
	  return new Response(null, { status: 500 })
    }
  //const res = await request.json()
  
}


