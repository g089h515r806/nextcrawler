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

import ProxySearchForm from "@/components/proxy-search-form"


export default async function ProxyPage({
  searchParams,
}) {

  const { page = '0',pageSize='20', label = '', server = '' } = await searchParams
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
    orderBy: { id : 'desc',},
	where: {},
  };
  if(label != ''){
    filters.where = {
	   label: {
		 contains: label,
	   },
	};
	filtersTotal.where = {
	   label: {
		 contains: label,
	   },
	};
  }
  if(server != ''){
    filters.where.server = {
	  contains: server,
	};
	filtersTotal.where.server = {
	  contains: server,
	};
  }  
  const proxies = await prisma.proxy.findMany(filters);
  const proxyCount = await prisma.proxy.count(filtersTotal);
  
  const totalPageNo = Math.ceil(proxyCount /  pageSizeInt) ;
  //if(totalPageNo = 0)
  let i = Math.floor(pageInt/10);
  let start = i * 10 + 1;
  let end =  i * 10 + 10;
  //for(index = page/10 + 1; index )

  let preUrl = "/admin/proxy?label=" + label + "&server=" + server + "&page=";
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
		id:"last",
		label:"末页",
		url: preUrl + (totalPageNo-1),
	  })
  }
  
  
   //console.log("page", page);
   //console.log("sort", sort);

  return (
    <div className="font-sans grid items-center justify-items-center p-8 pb-20 sm:p-20">
	  <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
		<div className="w-full justify-items-center"> <h2 className="text-2xl font-bold">代理管理 </h2></div>
		<div className="w-full flex flex-row-reverse"><Button className="w-32"><Link href={ '/admin/proxy/add'}>添加代理</Link></Button></div>

		
	<ProxySearchForm />
		
    <div className="w-full">
	 { proxies.length > 0 && (
     <Table>
       <TableHeader>
         <TableRow>
           <TableHead>ID</TableHead>
           <TableHead>标签</TableHead>
           <TableHead>服务器</TableHead>
		   <TableHead>用户名</TableHead>
		   <TableHead>编辑</TableHead>
		   <TableHead>删除</TableHead>
         </TableRow>
       </TableHeader>
       <TableBody>
         {proxies.map((row) => (
           <TableRow key={row.id}>
             <TableCell>{row.id}</TableCell>
             <TableCell>{row.label}</TableCell>
             <TableCell>{row.server}</TableCell>
			 <TableCell>{row.username}</TableCell>
			 <TableCell><Link href={ '/admin/proxy/' + row.id + '/edit'}>编辑</Link></TableCell>
			 <TableCell><Link href={ '/admin/proxy/' + row.id + '/delete'}>删除</Link></TableCell>
           </TableRow>
         ))}
       </TableBody>
     </Table>
	 )}	
	 
	 { proxies.length == 0 && (
	 
		<Empty>
		  <EmptyHeader>
			<EmptyTitle>当前还没有代理</EmptyTitle>
			<EmptyDescription>
			  现在还没有创建任何代理，你可以现在创建一个.
			</EmptyDescription>
		  </EmptyHeader>
		  <EmptyContent>
			<div className="flex gap-2">
			  <Button><Link href={ '/admin/proxy/add'}>添加代理</Link></Button>
			 
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
