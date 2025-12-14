import prisma from '@/lib/prisma';



export async function POST(request) {
  try {
	const feedsTmp = await request.json();
	
	console.log("feedsTmp", feedsTmp);
	  
	for(let i=0; i < feedsTmp.length; i++){
		let feedTmp = feedsTmp[i];
		let url = feedTmp.url || ""
		let feed = await prisma.feed.findFirst({
		  where: {
			url: url,
		  },
		});
		console.log("feed", feed);
		//不存在才新建，存在的更新， 暂时不支持config
		if (!feed) {
			await prisma.feed.create({ data: {
				label:feedTmp.label,
				url:feedTmp.url,
				interval: parseInt(feedTmp.interval) || 0,
				fetchStatus: parseInt(feedTmp.fetchStatus) || 0,
				grade: parseInt(feedTmp.grade) || 2,
				useTemplate: parseInt(feedTmp.useTemplate) == 1 ? true : false,
				tcode: feedTmp.tcode || null,
				config: null,
			} });			
		}else{
			await prisma.feed.update({
			  where: {
				id: feed.id,
			  },
			  data: {
				label: feedTmp.label || '',
				url: feedTmp.url || '',
				interval: parseInt(feedTmp.interval) || 0,
				fetchStatus: parseInt(feedTmp.fetchStatus) || 0,
				grade: parseInt(feedTmp.grade) || 2,
				useTemplate: parseInt(feedTmp.useTemplate) == 1 ? true : false,
				tcode: feedTmp.tcode || null,
			  },
			})			
		}	  
	}
	  
	return new Response(null, { status: 204 })
  }catch (err) {
	console.log("err", err);
      //ctx.throw(422);
	return new Response(null, { status: 500 })
  }
}
