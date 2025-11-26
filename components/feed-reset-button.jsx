'use client'

import { Button } from "@/components/ui/button"

export default function ResetButton({ id }) {

  const manualReset = (id) => {
     console.log("id", id);
    
    fetch('/api/feed/'+id + "/reset")
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
  return <Button onClick={() => manualReset(id)}>重置</Button>
 
}
