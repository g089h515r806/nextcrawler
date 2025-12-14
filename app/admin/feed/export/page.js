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
import FeedExportButton  from "@/components/feed-export-button"

export default async function FeedExportPage({searchParams,}) {

const { page = '0',pageSize='20' } = await searchParams
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


  
  const feeds = await prisma.feed.findMany(filters);
  const feedCount = await prisma.feed.count(filtersTotal);
  
  const totalPageNo = Math.ceil(feedCount /  pageSizeInt) ;
  //if(totalPageNo = 0)
  let i = Math.floor(pageInt/10);
  let start = i * 10 + 1;
  let end =  i * 10 + 10;
  //for(index = page/10 + 1; index )

  let preUrl = "/admin/feed/export?page=";  
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
		id:start,
		label:start,
		url: preUrl + (start-1),
		isActive: (start-1) == pageInt ? true:false,
	}) 
	start++;
  }  
  if(totalPageNo > 0) {   
	  pageItems.push({
		id:"Last",
		label:"末页",
		url: preUrl + (totalPageNo-1),
	  })
  }


  return (
    <div className="font-sans grid items-center justify-items-center p-8 pb-20 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <div className="w-full justify-items-center"> <h2 className="text-2xl font-bold">导出种子</h2></div>
		<div className="w-full flex flex-row-reverse"> <FeedExportButton /> </div>
		
    <div className="w-full">
	 { feeds.length > 0 && (
     <Table id="feeds-table">
       <TableHeader>
         <TableRow>
           <TableHead className="w-64 whitespace-break-spaces break-all">label</TableHead>
		   <TableHead  className="w-64 whitespace-break-spaces break-all">url</TableHead>
		   <TableHead>interval</TableHead>
		   <TableHead>fetchStatus</TableHead>
		   <TableHead>grade</TableHead>
		   <TableHead>useTemplate</TableHead>

		   <TableHead>tcode</TableHead>
		   
         </TableRow>
       </TableHeader>
       <TableBody>
         {feeds.map((row) => (
           <TableRow key={row.id}>
             <TableCell className="w-64 whitespace-break-spaces break-all">{row.label}</TableCell>
             <TableCell className="w-64 whitespace-break-spaces break-all">{row.url}</TableCell>
			 <TableCell>{row.interval}</TableCell>
			 <TableCell>{row.fetchStatus}</TableCell>
			 <TableCell>{row.grade}</TableCell>
			 <TableCell>{row.useTemplate ? "1" : ""}</TableCell>
			 <TableCell>{row.tcode}</TableCell>

           </TableRow>
         ))}
       </TableBody>
     </Table>
	 )}
	 { feeds.length == 0 && (
	 
		<Empty>
		  <EmptyHeader>
			<EmptyTitle>当前还没有种子</EmptyTitle>
			<EmptyDescription>
			  现在还没有创建任何种子，你可以现在创建一个.
			</EmptyDescription>
		  </EmptyHeader>


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
