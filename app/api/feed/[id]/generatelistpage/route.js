import prisma from '@/lib/prisma';
import FeedService from '@/lib/feed-service';

export async function GET(request,{ params }) {
	try {
		const { id } = await params
		const feed = await prisma.feed.findUnique({
		  where: {
			id: parseInt(id),
		  },
		  include: {
		    template: true,
		  },		  
		})
		//console.log("feed", feed);
		
		await FeedService.generateListPage(feed);

		return new Response(JSON.stringify({msg:"success"}), { status: 200 })
		//return new Response.json(proxy);
	}catch (err) {
      //ctx.throw(422);
	  console.log("err", err);
	  return new Response(null, { status: 500 })
    }
  //const res = await request.json()
  
}


