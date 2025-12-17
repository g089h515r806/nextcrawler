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

import  ExportItemsButton  from "@/components/feed-exportitems-button"

const getExportFields = (feed) => {
    let fields = ["id", "title","url","content", "comments"];
	//console.log("feed", feed);
	let config = {};
    if(feed?.useTemplate){
		config = feed?.template?.config || {}
	}else{
		config = feed?.config || {}
	}	
	let fields1 = config?.feedParser?.fields || [];
    for(var i = 0; i < fields1.length; i++){		  
	  let parserField = fields1[i];
	  
	  let name = parserField['name'] || "";
	  if(name != "" && fields.indexOf(name) == -1){
		 fields.push(name); 
	  }
	}
    //console.log("fields1", fields1);			  
    let fields2 = config?.itemParser?.fields || [];
    for(var i = 0; i < fields2.length; i++){		  
	  let parserField = fields2[i];
	  
	  let name = parserField['name'] || "";
	  if(name != "" && fields.indexOf(name) == -1){
		 fields.push(name);
         //console.log("name", name);		 
	  }
	}
    //console.log("fields2", fields2);	
	//console.log("fields", fields);
	return fields;
}; 

export default async function FeedItemsPage({ params, searchParams,}) {
  const { id } = await params
  const { page = '0',pageSize='500', sort = 'asc', query = '' } = await searchParams
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
  
  const feed = await prisma.feed.findUnique({
	  where: {
		id: parseInt(id),
	  },
	  include: {
		template: true,
	  },		  
	})
  let exportFields = getExportFields(feed);
  
  const items = await prisma.item.findMany(filters);
  const itemCount = await prisma.item.count(filtersTotal);
  
  //console.log("items", items);
  
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
		url:"/admin/feed/"+ id +"/exportitems?page=0",
	  })
  }
  
  while(start <= end &&  start <= totalPageNo){
	pageItems.push({
		id: start,
		label: start,
		url:"/admin/feed/"+ id +"/exportitems?page=" + (start-1),
		isActive: (start-1) == pageInt ? true:false,
	}) 
	start++;
  }  
  if(totalPageNo > 0) {  
	  pageItems.push({
		id:"last",
		label:"末页",
		url:"/admin/feed/"+ id +"/exportitems?page=" + (totalPageNo-1),
	  })
  }

  const getFieldText = (item, fieldName) => {
	let defaultFields = ["id", "title","url","content"];
	let ret = "";
    if(defaultFields.indexOf(fieldName) != -1){
	  ret = item[fieldName];
	  return ret;
	}
	
	ret = item.data[fieldName] || "";
	
	if(typeof ret !== 'string'){
		ret = JSON.stringify(ret)
	}
	
	return ret;
  };
  
 
  
 

  return (
    <div className="font-sans grid items-center justify-items-center p-8 pb-20 sm:p-20">
	  <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
		<div className="w-full justify-items-center"> <h2 className="text-2xl font-bold">导出条目 </h2></div>

<div className="w-full flex flex-row-reverse"> <ExportItemsButton /> </div>


    <div className="w-full">
	
	{ items.length > 0 && (
     <Table id="feed-items-table">
       <TableHeader>
         <TableRow>
		 
		  {exportFields.map((exportField, index) => (
		    <TableHead key={"" + index} className={index>2 ? 'w-64 whitespace-break-spaces break-all hidden' : 'w-64 whitespace-break-spaces break-all'}>{exportField}</TableHead>
			
		  ))}

         </TableRow>
       </TableHeader>
       <TableBody>
         {items.map((row) => (
           <TableRow key={row.id}>
		  {exportFields.map((exportField, index) => (
		    <TableCell key={"" + row.id + index} className={index>2 ? 'w-64 whitespace-break-spaces break-all hidden' : 'w-64 whitespace-break-spaces break-all'}>{getFieldText(row, exportField)}</TableCell>
		
		  ))}		   


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
