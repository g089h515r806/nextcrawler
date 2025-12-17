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

import TemplateSearchForm from "@/components/template-search-form"

export default async function TemplatePage({ searchParams,}) {

  const { page = '0',pageSize='20', label = '', code = ''} = await searchParams
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
  if(code != ''){
    filters.where.code = {
	  contains: code,
	};
	filtersTotal.where.code = {
	  contains: code,
	};
  }  
  
  const templates = await prisma.template.findMany(filters);
  const templateCount = await prisma.template.count(filtersTotal);
  
  const totalPageNo = Math.ceil(templateCount /  pageSizeInt) ;
  //if(totalPageNo = 0)
  let i = Math.floor(pageInt/10);
  let start = i * 10 + 1;
  let end =  i * 10 + 10;
  //for(index = page/10 + 1; index )

  let preUrl = "/admin/template?label=" + label + "&code=" + code + "&page=";  
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
		<div className="w-full justify-items-center"> <h2 className="text-2xl font-bold">模板管理 </h2></div>
		<div className="w-full flex flex-row-reverse">
		  <Button className="w-32 ml-8"><Link href={ '/admin/template/import'}>导入模板</Link></Button>
		  <Button className="w-32"><Link href={ '/admin/template/add'}>添加模板</Link></Button>
		</div>
        
		<TemplateSearchForm />
    <div className="w-full">
	 { templates.length > 0 && (
     <Table>
       <TableHeader>
         <TableRow>
           <TableHead>ID</TableHead>
           <TableHead>标签</TableHead>
           <TableHead>编码</TableHead>
		   <TableHead>添加种子</TableHead>
		   <TableHead>导出</TableHead>
		   <TableHead>编辑</TableHead>
		   <TableHead>删除</TableHead>
         </TableRow>
       </TableHeader>
       <TableBody>
         {templates.map((row) => (
           <TableRow key={row.id}>
             <TableCell>{row.id}</TableCell>
             <TableCell>{row.label}</TableCell>
             <TableCell>{row.code}</TableCell>
			 <TableCell><Link href={ '/admin/feed/add?templateId=' + row.id}>添加种子</Link></TableCell>
			 <TableCell><Link href={ '/admin/template/' + row.id + '/export'}>导出</Link></TableCell>
			 <TableCell><Link href={ '/admin/template/' + row.id + '/edit'}>编辑</Link></TableCell>
			 <TableCell><Link href={ '/admin/template/' + row.id + '/delete'}>删除</Link></TableCell>
           </TableRow>
         ))}
       </TableBody>
     </Table>
	 )}
	 { templates.length == 0 && (
	 
		<Empty>
		  <EmptyHeader>
			<EmptyTitle>当前还没有模板</EmptyTitle>
			<EmptyDescription>
			  现在还没有创建任何模板，你可以现在创建一个.
			</EmptyDescription>
		  </EmptyHeader>
		  <EmptyContent>
			<div className="flex gap-2">
			  <Button><Link href={ '/admin/template/add'}>添加模板</Link></Button>
			 
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
