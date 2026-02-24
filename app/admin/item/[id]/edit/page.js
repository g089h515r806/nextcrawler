//import Image from "next/image";
'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'
//import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// This is options data for select option.
const data = {
  
  fetchStatusOptions: [
    //{key: "none", label: "None",},
    {key: 0, label: "未抓取",},
	{key: 1, label: "抓取成功",},
	{key: 2, label: "抓取失败",},
  ],
  
}

export default function ItemEditPage() {

  const params = useParams()
  const { id } = params;
  
  const [item, setItem] = useState({
    title: '',
    url: '',
	content: '',
    image: '',
    video: '',
    author: '',
    publishTime: '',
	fetchStatus: 0,
	feedId: '',
  });
  
  const [synced, setSynced] = useState(false);
 
  const [dataStr, setDataStr] = useState(""); 
  

  const handleChange = (e) => {
    const { name, value } = e.target;
	
	//console.log("name", name);
	//console.log("value", value);
	let newItem = {
      ...item,
      [name]: value
    };
	//console.log("newItem", newItem);
    setItem(newItem);
  };
  
  const handleFetchStatusChange = (value) => {
	let newItem = {
      ...item,
      fetchStatus: value
    };
	//console.log("newItem", newItem);
    setItem(newItem);
  };  

  const handleSubmit = async (e) => {
    e.preventDefault();
	
    try {
	  
	  let dataJson =  null;
	  if(dataStr != ""){
		dataJson = JSON.parse(dataStr);
	  }
	  
      const response = await fetch('/api/item/'+id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
		    title: item.title,
			url: item.url,
			content: item.content,
			image: item.image,
			video: item.video,
			author: item.author,
			publishTime: item.publishTime,
			feedId: parseInt(item.feedId),
			fetchStatus: parseInt(item.fetchStatus),
			data:dataJson,
			synced: synced, 
		}),
      });
	  
	  console.log("response", response);
      if (response.ok) {
        alert('表单提交成功!');
        // 重置表单或进行其他操作
        setItem({ title: '', url: '', content: '', fetchStatus: 0, });
		setSynced(false);
		//window.history.replaceState(null, '', '/proxies');
		window.location.href = '/admin/item';
      } else {
        alert('表单提交失败.');
      }
    } catch (error) {
      console.error('提交表单时出错:', error);
      alert('表单提交失败.');
    }
  };
  
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
		    image: dataItem.image || '',
		    video: dataItem.video || '',
		    author: dataItem.author || '',
		    publishTime: dataItem.publishTime || '',
			feedId: dataItem.feedId || '',
		    fetchStatus: dataItem.fetchStatus || 0,
						
		})
        setSynced(dataItem.synced || false);
		
		let dataJson = dataItem.data || null;
        if(dataJson != null){
		  setDataStr(JSON.stringify(dataJson, null, 4));
		}		
        //setLoading(false)
      })
  }, []);


  return (
    <div className="">
      <main className="">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl"> 添加条目 </CardTitle>
        </CardHeader>
        <CardContent>
          <form  onSubmit={handleSubmit}>
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="title">标题</FieldLabel>
                <Input
                  id="title"
				  name="title"
                  type="text"
				  value={item.title}
				  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="url">网址</FieldLabel>
                </div>
                <Input id="url" name="url" type="text"  value={item.url} onChange={handleChange} required />
              </Field>
			  
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="content">内容</FieldLabel>
                </div>
				
				<Textarea id="content" name="content" className="max-h-96" value={item.content} onChange={handleChange}/>
               
              </Field>	
			  
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="image">封面图像</FieldLabel>
                </div>
                <Input id="image" name="image" type="text"  value={item.image} onChange={handleChange} />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="video">视频</FieldLabel>
                </div>
                <Input id="video" name="video" type="text"  value={item.video} onChange={handleChange} />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="author">作者</FieldLabel>
                </div>
                <Input id="author" name="author" type="text"  value={item.author} onChange={handleChange} />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="publishTime">发布日期</FieldLabel>
                </div>
                <Input id="publishTime" name="publishTime" type="text"  value={item.publishTime} onChange={handleChange} />
              </Field>
			  
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="dataStr">Json 数据</FieldLabel>
                </div>
				
				<Textarea id="dataStr" name="dataStr" className="max-h-96" value={dataStr} onChange={(e)=>setDataStr(e.target.value)}/>
               
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="feedId">所属种子ID</FieldLabel>
                </div>
                <Input id="feedId" name="feedId" type="text"  value={item.feedId} onChange={handleChange} required />
              </Field>
			  
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="fetchStatus">抓取状态</FieldLabel>
                </div>
                <Select id="fetchStatus" name="fetchStatus" value={ parseInt(item.fetchStatus)} onValueChange={ handleFetchStatusChange}>
				  <SelectTrigger className="w-[180px]">
					<SelectValue placeholder="选择抓取状态" />
				  </SelectTrigger>
				  <SelectContent>
					<SelectGroup>
					{data.fetchStatusOptions.map((fetchStatusOption, index) => (
					
					  <SelectItem key={index} value={fetchStatusOption.key}>{fetchStatusOption.label}</SelectItem>
					  ))
					 }					  
			  
					</SelectGroup>
				  </SelectContent>
				</Select>				
          
              </Field>		  

				<div className="flex items-start gap-3">
					<Checkbox id="synced" name="synced" checked={synced} onCheckedChange={setSynced} />
					<div className="grid gap-2">
					  <Label htmlFor="synced">已同步</Label>
					</div>
				  </div>	  
			  
              <Field>
                <Button type="submit">保存</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      </main>
    </div>
  );
}
