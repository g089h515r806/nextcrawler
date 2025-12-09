import  runCronJob  from "@/lib/cron-job"


//需要周期性的访问这个url，可以借助于操作系统的crontab
export async function GET(request) {

  try{
    await runCronJob();
	return new Response(null, { status: 204 })
  }catch (err) {
	console.log("err", err);
	return new Response(null, { status: 500 })
  } 

}

