'use client'

import { Button } from "@/components/ui/button"

export default function ListpageFetchButton({ id }) {

  const manualFetch = (id) => {
     console.log("id", id);
    
    fetch('/api/listpage/'+id + "/fetch")
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
  return <Button onClick={() => manualFetch(id)}>运行</Button>
 
}
