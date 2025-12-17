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
import  FetchButton  from "@/components/feed-fetch-button"
import  ResetButton  from "@/components/feed-reset-button"
import FeedSearchForm from "@/components/feed-search-form"

export default async function FeedPage({searchParams,}) {

const { page = '0',pageSize='20', label = '', url = '', fetchStatus = '', grade = '' } = await searchParams
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
  if(url != ''){
    filters.where.url = {
	  contains: url,
	};
	filtersTotal.where.url = {
	  contains: url,
	};
  }

  if(fetchStatus != ''){
    filters.where.fetchStatus = parseInt(fetchStatus);
	filtersTotal.where.fetchStatus = parseInt(fetchStatus);
  }  
  
  if(grade != ''){
    filters.where.grade = parseInt(grade);
	filtersTotal.where.grade = parseInt(grade);
  }  
  
  const feeds = await prisma.feed.findMany(filters);
  const feedCount = await prisma.feed.count(filtersTotal);
  
  const totalPageNo = Math.ceil(feedCount /  pageSizeInt) ;
  //if(totalPageNo = 0)
  let i = Math.floor(pageInt/10);
  let start = i * 10 + 1;
  let end =  i * 10 + 10;
  //for(index = page/10 + 1; index )

  let preUrl = "/admin/feed?label=" + label + "&url=" + url + "&page=";  
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
        <div className="w-full justify-items-center"> <h2 className="text-2xl font-bold">种子管理 </h2></div>
		<div className="w-full flex flex-row-reverse"><Button className="w-32 ml-8"><Link href={ '/admin/feed/export'}>导出种子</Link></Button><Button className="w-32 ml-8"><Link href={ '/admin/feed/import'}>导入种子</Link></Button><Button className="w-32"><Link href={ '/admin/feed/add'}>添加种子</Link></Button></div>
		<FeedSearchForm />
    <div className="w-full">
	 { feeds.length > 0 && (
     <Table>
       <TableHeader>
         <TableRow>
           <TableHead>ID</TableHead>
           <TableHead className="w-128 whitespace-break-spaces break-all">标签/网址</TableHead>

		   <TableHead>抓取状态</TableHead>
		   <TableHead>运行</TableHead>
		   <TableHead>重置</TableHead>
		   <TableHead>分页</TableHead>
		   <TableHead>条目</TableHead>
		   <TableHead>编辑</TableHead>
		   <TableHead>删除</TableHead>
         </TableRow>
       </TableHeader>
       <TableBody>
         {feeds.map((row) => (
           <TableRow key={row.id}>
             <TableCell>{row.id}</TableCell>
             <TableCell>
			  <div>{row.label}</div>
			  <div>{row.url}</div>
			 </TableCell>

			 <TableCell>{getFetchStatusText(row.fetchStatus)}</TableCell>
			 <TableCell><FetchButton id={"" + row.id}/></TableCell>
			 <TableCell><ResetButton id={"" + row.id}/></TableCell>
			 <TableCell><Link href={ '/admin/feed/' + row.id + '/listpages'}>分页</Link></TableCell>
			 <TableCell><Link href={ '/admin/feed/' + row.id + '/items'}>条目</Link></TableCell>
			 <TableCell><Link href={ '/admin/feed/' + row.id + '/edit'}>编辑</Link></TableCell>
			 <TableCell><Link href={ '/admin/feed/' + row.id + '/delete'}>删除</Link></TableCell>
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
		  <EmptyContent>
			<div className="flex gap-2">
			  <Button><Link href={ '/admin/feed/add'}>添加种子</Link></Button>
			 
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
