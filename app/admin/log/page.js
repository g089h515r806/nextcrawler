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

export default async function LogPage({searchParams,}) {

  const { page = '0',pageSize='20', sort = 'asc', query = '' } = await searchParams
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
  if(query != ''){
    filters.where = {
	   label: {
		 contains: query,
	   },
	};
	filtersTotal.where = {
	   label: {
		 contains: query,
	   },
	};
  }
  const logs = await prisma.watchdog.findMany(filters);
  const logCount = await prisma.watchdog.count(filtersTotal);
  
  const totalPageNo = Math.ceil(logCount /  pageSizeInt) ;
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
		url:"/admin/log?page=0",
	  })
  }
  
  while(start <= end &&  start <= totalPageNo){
	pageItems.push({
		id:start,
		label:start,
		url:"/admin/log?page=" + (start-1),
		isActive: (start-1) == pageInt ? true:false,
	}) 
	start++;
  }  
  
  if(totalPageNo > 0) {
	  pageItems.push({
		id:"last",
		label:"末页",
		url:"/admin/log?page=" + (totalPageNo-1),
	  })
  }
  
  
   console.log("page", page);
   console.log("sort", sort);


  return (
    <div className="font-sans grid items-center justify-items-center p-8 pb-20 sm:p-20">
	  <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
		<div className="w-full justify-items-center"> <h2 className="text-2xl font-bold">日志管理 </h2></div>
		
    <div className="w-full">
	{ logs.length > 0 && (
     <Table>
       <TableHeader>
         <TableRow>
           <TableHead>ID</TableHead>
           <TableHead>类型</TableHead>
           <TableHead>级别</TableHead>
		    <TableHead className="w-8">消息</TableHead>
		   <TableHead>查看</TableHead>
		   <TableHead>删除</TableHead>
         </TableRow>
       </TableHeader>
       <TableBody>
         {logs.map((row) => (
           <TableRow key={row.id}>
             <TableCell>{row.id}</TableCell>
             <TableCell>{row.type}</TableCell>
			  <TableCell>{row.severity}</TableCell>
             <TableCell className="w-128 whitespace-break-spaces break-all"><p className="break-normal">{row.message}</p></TableCell>
			 <TableCell><Link href={ '/admin/log/' + row.id + ''}>查看</Link></TableCell>
			 <TableCell><Link href={ '/admin/log/' + row.id + '/delete'}>删除</Link></TableCell>
           </TableRow>
         ))}
       </TableBody>
     </Table>
	  )}	
	 { logs.length == 0 && (
	 
		<Empty>
		  <EmptyHeader>
			<EmptyTitle>当前还没有日志</EmptyTitle>
			<EmptyDescription>
			  现在还没有创建任何日志.
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
