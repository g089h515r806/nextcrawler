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

export default function FeedAddPage() {

  const [item, setItem] = useState({
	limitNumFeed: 2,
	limitNumListPage: 2,
	limitNumItem: 5,
	useProxy: false,
	useCronJob: false,
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
		})
		
      })
  }, []);


  return (
    <div className="">
      <main className="">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl"> 系统设置 </CardTitle>
        </CardHeader>
        <CardContent>
          <form  onSubmit={handleSubmit}>
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

				<div className="flex items-start gap-3">
					<Checkbox id="useProxy" name="useProxy" checked={item.useProxy} onCheckedChange={handleUseProxyChange} />
					<div className="grid gap-2">
					  <Label htmlFor="useProxy">使用代理</Label>
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
