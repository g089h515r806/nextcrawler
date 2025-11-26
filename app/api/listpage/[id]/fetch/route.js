import prisma from '@/lib/prisma';
import FeedService from '@/lib/feed-service';

export async function GET(request,{ params }) {
	try {
		const { id } = await params
		const listpage = await prisma.listpage.findUnique({
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
		console.log("listpage", listpage);
		
		let ret = await FeedService.fetchListPageOnly(listpage);
		if(!ret){
		  return new Response(null, { status: 500 })
		}		
		
		
		return new Response(JSON.stringify(listpage), { status: 200 })
		//return new Response.json(proxy);
	}catch (err) {
      //ctx.throw(422);
	  console.log("err", err);
	  return new Response(null, { status: 500 })
    }
  //const res = await request.json()
  
}


