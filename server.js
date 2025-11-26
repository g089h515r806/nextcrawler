import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
//import cron from 'node-cron';
import { CronJob } from 'cron';
import  runCronJob  from "./lib/cron-job.js";
 
const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
 
app.prepare().then(() => {
	//设置定时任务
    var job = new CronJob(
		'* * * * *', //每分钟
		async function() {
			await runCronJob();
			console.log('You will see this message every minute type');
		},
		null,
		true,
		'Asia/Shanghai'
	);
	
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(port)
 
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})