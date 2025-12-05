//import Image from "next/image";
'use client'
import React, { useState, useEffect } from 'react';
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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function SystemConfigPage() {

  const [item, setItem] = useState({
	limitNumFeed: 2,
	limitNumListPage: 2,
	limitNumItem: 5,
	useProxy: false,
	useCronJob: false,
	usePersistentContext:false,
    userDataDir:"",
	channel:"",
	headless: false,
  });
  
  //const [status, setStatus] = React.useState(false);

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
  
  const handleUseProxyChange = (value) => {
	let newItem = {
      ...item,
      useProxy: value
    };
	//console.log("newItem", newItem);
    setItem(newItem);
  };  

  const handleUseCronJobChange = (value) => {
	let newItem = {
      ...item,
      useCronJob: value
    };
	//console.log("newItem", newItem);
    setItem(newItem);
  };
  
  const handleUsePersistentContextChange = (value) => {
	let newItem = {
      ...item,
      usePersistentContext: value
    };
	//console.log("newItem", newItem);
    setItem(newItem);
  };

  const handleHeadlessChange = (value) => {
	let newItem = {
      ...item,
      headless: value
    };
	//console.log("newItem", newItem);
    setItem(newItem);
  };  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
	
	//if(item.password != item.password1){
	//  alert("密码必须一致");
	//  return;
	//}
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
		  key: "system",
		  value: {
			  limitNumFeed:parseInt(item.limitNumFeed),
			  limitNumListPage:parseInt(item.limitNumListPage),
			  limitNumItem:parseInt(item.limitNumItem),	
			  useProxy: item.useProxy || false,	
			  useCronJob: item.useCronJob || false,
			  usePersistentContext:item.usePersistentContext || false,
			  userDataDir:item.userDataDir || "",
			  channel: item.channel || "",
			  headless: item.headless || false,		  
		  }
 
		}),
      });
	  
	  console.log("response", response);
      if (response.ok) {
        alert('表单提交成功!');
        // 重置表单或进行其他操作
        //setItem({ label: '', url: '', interval: 0, fetchStatus: 0, });
		
		//window.history.replaceState(null, '', '/proxies');
		window.location.href = '/admin/config/system';
      } else {
        alert('表单提交失败.');
      }
    } catch (error) {
      console.error('提交表单时出错:', error);
      alert('表单提交失败.');
    }
  };
  
  useEffect(() => {
    fetch('/api/config?key=system')
      .then((res) => res.json())
      .then((data) => {
	  console.log("data", data);
	   let value = data.value || {};
        setItem({
			limitNumFeed: value.limitNumFeed || 2,
			limitNumListPage: value.limitNumListPage || 2,
			limitNumItem: value.limitNumItem || 5,
			useProxy: value.useProxy || false,
			useCronJob: value.useCronJob || false,
			usePersistentContext:value.usePersistentContext || false,
			userDataDir:value.userDataDir || "",
			channel: value.channel || "",
			headless: value.headless || false,					
		})
		
      })
  }, []);


  return (
    <div className="font-sans grid items-center justify-items-center p-8 pb-20 sm:p-20">
   <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <div className="w-full justify-items-center"> <h2 className="text-2xl font-bold">系统设置 </h2></div>
	  
      <Tabs defaultValue="cron" className="w-full justify-items-center">
	    <form  onSubmit={handleSubmit}>
        <TabsList>
          <TabsTrigger value="cron">定时任务</TabsTrigger>
          <TabsTrigger value="browser">浏览器</TabsTrigger>
        </TabsList>
        <TabsContent value="cron">
          <Card>
            <CardContent className="grid gap-6">	

            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="limitNumFeed">每次采集种子数量</FieldLabel>
                <Input
                  id="limitNumFeed"
				  name="limitNumFeed"
                  type="number"
				  value={item.limitNumFeed}
				  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="limitNumListPage">每次采集分页数量</FieldLabel>
                </div>
                <Input id="limitNumListPage" name="limitNumListPage" type="number"  value={item.limitNumListPage} onChange={handleChange} required />
              </Field>
			  
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="limitNumItem">每次采集条目数量</FieldLabel>
                </div>
                <Input id="limitNumItem" name="limitNumItem" type="text"  value={item.limitNumItem} onChange={handleChange} required />
              </Field>	

				<div className="flex items-start gap-3">
					<Checkbox id="useCronJob" name="useCronJob" checked={item.useCronJob} onCheckedChange={handleUseCronJobChange} />
					<div className="grid gap-2">
					  <Label htmlFor="useCronJob">启用定时采集任务</Label>
					</div>
				  </div>
            </FieldGroup>
			
	        </CardContent>
		  </Card>
		</TabsContent>
		
        <TabsContent value="browser">
          <Card>
            <CardContent className="grid gap-6">
				<div className="flex items-start gap-3">
					<Checkbox id="useProxy" name="useProxy" checked={item.useProxy} onCheckedChange={handleUseProxyChange} />
					<div className="grid gap-2">
					  <Label htmlFor="useProxy">使用代理</Label>
					</div>
				  </div>
				  
				<div className="flex items-start gap-3">
					<Checkbox id="usePersistentContext" name="usePersistentContext" checked={item.usePersistentContext} onCheckedChange={handleUsePersistentContextChange} />
					<div className="grid gap-2">
					  <Label htmlFor="usePersistentContext">使用持久化上下文(Persistent Context)</Label>
					</div>
				  </div>				  
				<div className="flex items-start gap-3">
					<Checkbox id="headless" name="headless" checked={item.headless} onCheckedChange={handleHeadlessChange} />
					<div className="grid gap-2">
					  <Label htmlFor="headless">无头模式(headless)</Label>
					</div>
				  </div>				  
              <Field>
                <FieldLabel htmlFor="userDataDir">用户数据目录(userDataDir)</FieldLabel>
                <Input
                  id="userDataDir"
				  name="userDataDir"
                  type="text"
				  value={item.userDataDir}
				  onChange={handleChange}

                />
              </Field>
			  
              <Field>
                <FieldLabel htmlFor="channel">channel(通道)</FieldLabel>
                <Input
                  id="channel"
				  name="channel"
                  type="text"
				  value={item.channel}
				  onChange={handleChange}

                />
              </Field>			  
			  
	        </CardContent>
		  </Card>
		</TabsContent>
		
		    <Field><Button type="submit">保存</Button></Field>
		
		</form>
	  </Tabs>


      </main>
    </div>
  );
}
