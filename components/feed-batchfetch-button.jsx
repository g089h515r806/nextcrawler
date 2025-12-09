'use client'

import { Button } from "@/components/ui/button"

export default function FetchBatchFetchButton({ id }) {

  const batchFetch = (id) => {
     console.log("id", id);
    
    fetch('/api/feed/'+id + "/batchfetch")
      .then((res) => res.json())
      .then((data) => {
		  console.log("data", data);
	     alert("运行成功");
      })
	  .catch(error => {
		// 处理错误
		console.log("error", error);
		 alert("运行失败");
	  });
	  
  };
  return <Button onClick={() => batchFetch(id)}>批量采集</Button>
 
}
