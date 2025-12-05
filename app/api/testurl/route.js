
import FeedService from '@/lib/feed-service';

export async function POST(request) {
  const data = await request.json()
  try{
	console.log("data", data);  
	let ret = await FeedService.testUrlOnly(data);
	if(!ret){
	  return new Response(null, { status: 500 })
	}
	console.log("ret", ret);
	return new Response({ "title":"success" }, { status: 200 })
  }catch (err) {
	  
	console.log("err", err);
	return new Response({ "title":"error" }, { status: 500 })
  } 	

}

