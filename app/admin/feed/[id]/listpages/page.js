//import Image from "next/image";
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

import  ListpageFetchButton  from "@/components/listpage-fetch-button"
import  GenerateListPageButton  from "@/components/generate-listpage-button"

export default async function FeedListpagesPage({params, searchParams,}) {

  const { id } = await params
  const { page = '0',pageSize='20', sort = 'asc', query = '' } = await searchParams
  //console.log("searchParams", searchParams);
  //console.log("request", request);
  let pageInt = parseInt(page);
  let pageSizeInt = parseInt(pageSize);
  
  let filtersTotal = {
    where:{
	   feedId: parseInt(id),
	},  
  }
  let filters = {
	skip: pageInt * pageSizeInt, // Skip records for previous pages
	take: pageSizeInt, // Limit to page size
    where:{
	   feedId: parseInt(id),
	},	
  };

  const listpages = await prisma.listpage.findMany(filters);
  const listpageCount = await prisma.listpage.count(filtersTotal);
  
  const totalPageNo = Math.ceil(listpageCount /  pageSizeInt) ;
  //if(totalPageNo = 0)
  let i = Math.floor(pageInt/10);
  let start = i * 10 + 1;
  let end =  i * 10 + 10;
  //for(index = page/10 + 1; index )

  
  let pageItems = [];

  if(totalPageNo > 0) {   
	  pageItems.push({
		id:"first",
		label:"首页",
		url:"/admin/feed/"+ id +"/listpages?page=0",
	  })
  }
  
  while(start <= end &&  start <= totalPageNo){
	pageItems.push({
		id:start,
		label:start,
		url:"/admin/feed/"+ id +"/listpages?page=" + (start-1),
		isActive: (start-1) == pageInt ? true:false,
	}) 
	start++;
  }  
  if(totalPageNo > 0) {     
	  pageItems.push({
		id:"last",
		label:"末页",
		url:"/admin/feed/"+ id +"/listpages?page=" + (totalPageNo-1),
	  })
  }
  
/*  
  const generateListPage = (e) => {
    //console.log("id", id);
    
    fetch('/api/item/'+id + "/generatelistpage")
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
*/
  const getFetchStatusText = (fetchStatus) => {
    let fetchStatusText = "";
	if(fetchStatus == 0){
		fetchStatusText = "未抓取";
	}else if(fetchStatus == 1){
		fetchStatusText = "成功";
	}else if(fetchStatus == 2){
		fetchStatusText = "失败";
	}
	
	return fetchStatusText;
  };

  return (
    <div className="font-sans grid items-center justify-items-center p-8 pb-20 sm:p-20">
	  <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
		<div className="w-full justify-items-center"> <h2 className="text-2xl font-bold">分页列表 </h2></div>
        <div className="w-full flex flex-row-reverse"><div className="w-32 ml-8"><GenerateListPageButton id={id}/> </div><Button className="w-32"><Link href={ '/admin/listpage/add'}>添加分页</Link></Button></div>
    <div className="w-full">
	{ listpages.length > 0 && (
     <Table>
       <TableHeader>
         <TableRow>
           <TableHead>ID</TableHead>
           <TableHead>网址</TableHead>
		   <TableHead>抓取状态</TableHead>
		   <TableHead>运行</TableHead>
		   <TableHead>编辑</TableHead>
		   <TableHead>删除</TableHead>
         </TableRow>
       </TableHeader>
       <TableBody>
         {listpages.map((row) => (
           <TableRow key={row.id}>
             <TableCell>{row.id}</TableCell>
             <TableCell>{row.url}</TableCell>
			 <TableCell>{getFetchStatusText(row.fetchStatus)}</TableCell>
			  <TableCell><ListpageFetchButton id={""+row.id}/></TableCell>
			 <TableCell><Link href={ '/admin/listpage/' + row.id + '/edit'}>编辑</Link></TableCell>
			 <TableCell><Link href={ '/admin/listpage/' + row.id + '/delete'}>删除</Link></TableCell>
           </TableRow>
         ))}
       </TableBody>
     </Table>
	 )}	

	 { listpages.length == 0 && (
	 
		<Empty>
		  <EmptyHeader>
			<EmptyTitle>当前还没有分页</EmptyTitle>
			<EmptyDescription>
			  现在还没有创建任何分页，你可以现在采集一些.
			</EmptyDescription>
		  </EmptyHeader>
		  <EmptyContent>

		  </EmptyContent>

		</Empty>		 
	 )}		 
    <Pagination>
      <PaginationContent>
	   {pageItems.map((item) => (
	   
        <PaginationItem key={item.id} >
          <PaginationLink href={item.url} isActive={item.isActive}>{item.label}</PaginationLink>
        </PaginationItem>   
	   ))}


      </PaginationContent>
    </Pagination>	 
	 
   </div>

      </main>
    </div>
  );
}
