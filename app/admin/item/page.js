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
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

import  ItemFetchButton  from "@/components/item-fetch-button"
import ItemSearchForm from "@/components/item-search-form"

export default async function ItemsPage({ searchParams,}) {

const { page = '0',pageSize='20', title = '', url = '' } = await searchParams
  //console.log("searchParams", searchParams);
  //console.log("request", request);
  let pageInt = parseInt(page);
  let pageSizeInt = parseInt(pageSize);
  
  let filtersTotal = {
    where: {},
  }
  let filters = {
	skip: pageInt * pageSizeInt, // Skip records for previous pages
	take: pageSizeInt, // Limit to page size
	where: {},
  };
  if(title != ''){
    filters.where = {
	   title: {
		 contains: title,
	   },
	};
	filtersTotal.where = {
	   title: {
		 contains: title,
	   },
	};
  }

  if(url != ''){
    filters.where.url = {
	  contains: url,
	};
	filtersTotal.where.url = {
	  contains: url,
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

   let preUrl = "/admin/item?title=" + title + "&url=" + url + "&page=";  
  let pageItems = [];
  if(totalPageNo > 0) { 
	  pageItems.push({
		id:"first",
		label:"首页",
		url: preUrl + "0",
	  })
  }
  
  while(start <= end &&  start <= totalPageNo){
	pageItems.push({
		id: start,
		label: start,
		url: preUrl + (start-1),
		isActive: (start-1) == pageInt ? true:false,
	}) 
	start++;
  }  
  
  if(totalPageNo > 0) { 
	  pageItems.push({
		id:"last",
		label:"末页",
		url: preUrl + (totalPageNo-1),
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
		<div className="w-full justify-items-center"> <h2 className="text-2xl font-bold">条目管理 </h2></div>
		<div className="w-full flex flex-row-reverse"><Button className="w-32"><Link href={ '/admin/item/add'}>添加条目</Link></Button></div>

		
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
             <TableCell>{row.id}</TableCell>
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
			<EmptyTitle>当前还没有条目</EmptyTitle>
			<EmptyDescription>
			  现在还没有创建任何条目，你可以现在创建一个.
			</EmptyDescription>
		  </EmptyHeader>
		  <EmptyContent>
			<div className="flex gap-2">
			  <Button><Link href={ '/admin/item/add'}>添加条目</Link></Button>
			 
			</div>
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
