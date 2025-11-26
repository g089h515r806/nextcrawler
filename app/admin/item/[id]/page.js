//import Image from "next/image";
'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'
import { Textarea } from "@/components/ui/textarea"

export default function FeedDetailPage() {
  const params = useParams()
  const { id } = params;
  
  const [item, setItem] = useState({
    title: '',
    url: '',
	content: '',
	fetchStatus: 0,
	feedId: '',
	synced: 0,
  });
  
  //const [synced, setSynced] = useState(false);
 
  const [dataStr, setDataStr] = useState("");   

  useEffect(() => {
    fetch('/api/item/'+id)
      .then((res) => res.json())
      .then((dataItem) => {
	  console.log("dataItem", dataItem);
        setItem({
			//id: data.id || '',
			//name: data.name || '',
		    title: dataItem.title || '',
		    url: dataItem.url || '',
		    content: dataItem.content || '',
			feedId: dataItem.feedId || '',
		    fetchStatus: dataItem.fetchStatus || 0,
			synced: dataItem.synced || 0,
						
		})
        //setSynced(dataItem.synced || false);
		
		let dataJson = dataItem.data || null;
        if(dataJson != null){
		  setDataStr(JSON.stringify(dataJson, null, 4));
		}		
        //setLoading(false)
      })
  }, []);
  
  return (
    <div className="font-sans grid items-center justify-items-center p-8 pb-20 sm:p-20">
	  <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
		<div className="w-full justify-items-center"> <h2 className="text-2xl font-bold">{item.title} </h2></div>
      
		<div dangerouslySetInnerHTML={{ __html: (item.content || "") }}></div>

		
		<Textarea id="dataStr" name="dataStr" className="max-h-96" defaultValue={dataStr} disabled/>


      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
