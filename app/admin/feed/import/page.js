//import Image from "next/image";
'use client'
import React, { useState} from 'react';
import  * as XLSX from 'xlsx';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function FeedExportPage() {

  const [rows, setRows] = useState([]);

  const handleFileChange = async (event) => {  
	  const file = event.target.files[0];
	  const data = await file.arrayBuffer();
	  
	  const workbook = XLSX.read(data, { type: 'buffer' });	
	  var sheetName = workbook.SheetNames[0] || "Feeds";
	  let jsonData =  XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      setRows(jsonData);

	  console.log("jsonData", jsonData);
  }
  
  const importFeeds = async() => {
    //event.preventDefault();
	
    try {
		
      const response = await fetch('/api/feed/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rows),
      });
	  
	  console.log("response", response);
      if (response.ok) {
        alert('导入成功!');
		//window.history.replaceState(null, '', '/proxies');
		window.location.href = '/admin/feed';
      } else {
        alert('导入失败.');
      }
	  
    } catch (error) {
      console.error('导入时出错:', error);
      alert('导入失败.');
    }
  };  

  return (
    <div className="font-sans grid items-center justify-items-center p-8 pb-20 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <div className="w-full justify-items-center"> <h2 className="text-2xl font-bold">导入种子</h2></div>



    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="feeds-file">种子文件</Label>
      <Input id="feeds-file" name="feeds-file" type="file" onChange={ handleFileChange }/>
	  
	  <Button onClick={() => importFeeds()}>导入种子</Button>
	  
	  <a href="/feedsdemo.xlsx">下载示例种子文件</a>

    </div>
		
    <div className="w-full">
	 { rows.length > 0 && (
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
         {rows.map((row, index) => (
           <TableRow key={index}>
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
	 
	 
   </div>

      </main>
    </div>
  );
}
