'use client'

import { Button } from "@/components/ui/button"

export default function GenerateListPageButton({ id }) {

  const generateListPage = (e) => {
    //console.log("id", id);
    
    fetch('/api/feed/'+id + "/generatelistpage")
      .then((res) => res.json())
      .then((data) => {
		 console.log("data", data);
	     alert("生成分页成功成功");
      })
	  .catch(error => {
		// 处理错误
		console.log("error", error);
		 alert("生成分页失败");
	  });
  };
  return <Button onClick={() => generateListPage(id)}>生成分页</Button>
 
}
