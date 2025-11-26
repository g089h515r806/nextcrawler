import prisma from '@/lib/prisma';
import FeedService from '@/lib/feed-service';

export async function GET(request,{ params }) {
	try {
		const { id } = await params
		const feed = await prisma.feed.findUnique({
		  where: {
			id: parseInt(id),
		  },		  
		})

        //如果feed存在，
		if(feed){
			//删除feed下面的items
			await prisma.item.deleteMany({
			  where: {
				feedId: parseInt(id),
			  },
			})
			//删除feed下面的listpage
			await prisma.listpage.deleteMany({
			  where: {
				feedId: parseInt(id),
			  },
			})			 
		}
		
		return new Response(JSON.stringify(feed), { status: 200 })
		//return new Response.json(proxy);
	}catch (err) {
      //ctx.throw(422);
	  console.log("err", err);
	  return new Response(null, { status: 500 })
    }
  //const res = await request.json()
  
}


