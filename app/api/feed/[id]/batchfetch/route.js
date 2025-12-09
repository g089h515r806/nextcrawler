import prisma from '@/lib/prisma.js';
import FeedService from '@/lib/feed-service.js';
import launchContext from '@/lib/browser-context.js';

export async function GET(request,{ params }) {
	try {
		const { id } = await params
		
		let config = await prisma.config.findFirst({
		  where: {
			key: "system",
		  },
		})

        let limitNum = parseInt(config?.value?.limitNumItem) || 5;	

		let filters = {
			take: limitNum, // Limit to page size
			where: {
			  fetchStatus: 0, //抓取状态等于0
			  feedId: parseInt(id), //当前feed id
			},
			include: {
			  feed: {
				include: {
					template: true,
				},				
			  },
			},
		};
		
		const items = await prisma.item.findMany(filters);
		
		const context = await launchContext();
		const page = context.pages()[0];		

		for(var i = 0; i < items.length; i++){
			await FeedService.fetchItem(page, items[i]);
		}		

		await context.close();
		
		return new Response(JSON.stringify({msg:"Success"}), { status: 200 });
		//return new Response.json(proxy);
	}catch (err) {
      //ctx.throw(422);
	  console.log("err", err);
	  return new Response(null, { status: 500 })
    }
  //const res = await request.json()
  
}


