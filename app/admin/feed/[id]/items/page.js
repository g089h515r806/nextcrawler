//import Image from "next/image";
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Button } from "@/components/ui/button"
import  ItemFetchButton  from "@/components/item-fetch-button"
import  FetchBatchFetchButton  from "@/components/feed-batchfetch-button"

export default async function FeedItemsPage({ params, searchParams,}) {
  const { id } = await params
  const { page = '0',pageSize='20', sort = 'asc', query = '' } = await searchParams
  //console.log("searchParams", searchParams);
  //console.log("request", request);
  let pageInt = parseInt(page);
  let pageSizeInt = parseInt(pageSize);
  
  let filtersTotal = {
    where:{
	   feedId: parseInt(id),
	   title:{},
	},
  }
  let filters = {
	skip: pageInt * pageSizeInt, // Skip records for previous pages
	take: pageSizeInt, // Limit to page size
	where:{
	   feedId: parseInt(id),
	   title:{},
	},
  };
  if(query != ''){
    filters.where.title = {
		 contains: query,
	};
	filtersTotal.where.title = {
	   contains: query,
	};
  }
  const items = await prisma.item.findMany(filters);
  const itemCount = await prisma.item.count(filtersTotal);
  
  const totalPageNo = Math.ceil(itemCount /  pageSizeInt) ;
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
		url:"/admin/feed/"+ id +"/items?page=0",
	  })
  }
  
  while(start <= end &&  start <= totalPageNo){
	pageItems.push({
		id: start,
		label: start,
		url:"/admin/feed/"+ id +"/items?page=" + (start-1),
		isActive: (start-1) == pageInt ? true:false,
	}) 
	start++;
  }  
  if(totalPageNo > 0) {  
	  pageItems.push({
		id:"last",
		label:"末页",
		url:"/admin/feed/"+ id +"/items?page=" + (totalPageNo-1),
	  })
  }

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
		<div className="w-full justify-items-center"> <h2 className="text-2xl font-bold">条目列表 </h2></div>

		<div className="w-full flex flex-row-reverse">
			<Button className="w-32 ml-8"><Link href={ '/admin/feed/' + id + '/exportitems'}>导出条目</Link></Button>
			<FetchBatchFetchButton id={ id } />
		</div>


    <div className="w-full">
	
	{ items.length > 0 && (
     <Table>
       <TableHeader>
         <TableRow>
           <TableHead>ID</TableHead>
           <TableHead className="w-128 whitespace-break-spaces break-all">标题/网址</TableHead>

		   <TableHead>抓取状态</TableHead>
		   <TableHead>运行</TableHead>
		   <TableHead>编辑</TableHead>
		   <TableHead>删除</TableHead>
         </TableRow>
       </TableHeader>
       <TableBody>
         {items.map((row) => (
           <TableRow key={row.id}>
             <TableCell> <Link href={ '/admin/item/' + row.id} target="_blank">{row.id}</Link></TableCell>
             <TableCell className="w-128 whitespace-break-spaces break-all">
			 	<div>{row.title}</div>
				<div>{row.url}</div>
			 </TableCell>

			 <TableCell>{getFetchStatusText(row.fetchStatus)}</TableCell>
			 <TableCell><ItemFetchButton id={""+row.id}/></TableCell>
			 <TableCell><Link href={ '/admin/item/' + row.id + '/edit'}>编辑</Link></TableCell>
			 <TableCell><Link href={ '/admin/item/' + row.id + '/delete'}>删除</Link></TableCell>
           </TableRow>
         ))}
       </TableBody>
     </Table>
	 )}	
	 
	 { items.length == 0 && (
	 
		<Empty>
		  <EmptyHeader>
			<EmptyTitle>当前还没有数据条目</EmptyTitle>
			<EmptyDescription>
			  现在还没有创建任何代理，你可以现在采集一下.
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
