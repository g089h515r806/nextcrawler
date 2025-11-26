//import Image from "next/image";
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation'
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

import {
  FeedConfigForm,
} from "@/components/feed-config-form"


// This is options data for select option.
const data = {

  intervalOptions: [
    //{key: "none", label: "None",},
    {key: 10, label: "10分钟",},
	{key: 30, label: "30分钟",},
	{key: 60, label: "1小时",},
	{key: 240, label: "4小时",},
	{key: 720, label: "12小时",},
	{key: 1440, label: "1天",},
	{key: 10080, label: "7天",},
	{key: 43200, label: "30天",},
	{key: 144000, label: "100天",},
	{key: 525600, label: "365天",},

  ],
  
  fetchStatusOptions: [
    //{key: "none", label: "None",},
    {key: 0, label: "未抓取",},
	{key: 1, label: "抓取成功",},
	{key: 2, label: "抓取失败",},
  ],

  gradeOptions: [
    //{key: "none", label: "None",},
    {key: 1, label: "A, 优秀",},
	{key: 2, label: "B, 一般",},
	{key: 3, label: "C, 较差",},
	{key: 4, label: "D, 废弃",},
  ],  
}

export default function FeedAddPage() {
  const searchParams = useSearchParams();
  let templateId = searchParams.get('templateId') || "";
  const childRef = useRef();	

  const [item, setItem] = useState({
    label: '',
    url: '',
	interval: 1440,
	fetchStatus: 0,
	grade: 2,
	useTemplate: false,
	tcode: '',	
  });
  
  const [loaded, setLoaded] = useState(false);
  
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
  
  const handleIntervalChange = (value) => {
	let newItem = {
      ...item,
      interval: value
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

  const handleGradeChange = (value) => {
	let newItem = {
      ...item,
      grade: value
    };
	//console.log("newItem", newItem);
    setItem(newItem);
  }; 

  const handleUseTemplateChange = (value) => {
	let newItem = {
      ...item,
      useTemplate: value
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
		let feedConfig = childRef?.current?.getValue() || {};
		console.log("feedConfig", feedConfig);
		
      const response = await fetch('/api/feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
		  label: item.label,
		  url: item.url,
		  interval:parseInt(item.interval),
		  fetchStatus:parseInt(item.fetchStatus),
		  grade:parseInt(item.grade),
		  useTemplate:item.useTemplate,
		  tcode:item.tcode,
          config:feedConfig,		  
		}),
      });
	  
	  console.log("response", response);
      if (response.ok) {
        alert('表单提交成功!');
        // 重置表单或进行其他操作
        setItem({ label: '', url: '', interval: 0, fetchStatus: 0,grade: 2, });
		
		//window.history.replaceState(null, '', '/proxies');
		window.location.href = '/admin/feed';
      } else {
        alert('表单提交失败.');
      }
	  
    } catch (error) {
      console.error('提交表单时出错:', error);
      alert('表单提交失败.');
    }
  };
  
  
  useEffect(() => {
	if(templateId != ""){
		fetch('/api/template/'+templateId)
		  .then((res) => res.json())
		  .then((data) => {
		    console.log("data", data);
			let tcode = data.code || "";
			if(tcode != ""){
				let newItem = {
				  ...item,
				  useTemplate: true,
				  tcode: tcode
				};

				setItem(newItem);				
				setLoaded(true);
			}else{
				setLoaded(true);
			}
			
			// console.log("item.config",item.config)

		  })
	}else{
		setLoaded(true);
	}
  }, []);  


  return (
    <div className="">
	  <main className="w-full">
	  
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl"> 添加种子 </CardTitle>
        </CardHeader>
        <CardContent>
          <form  onSubmit={handleSubmit}>
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="label">标签</FieldLabel>
                <Input
                  id="label"
				  name="label"
                  type="text"
				  value={item.label}
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
                  <FieldLabel htmlFor="interval">抓取频率</FieldLabel>
                </div>
				
                <Select id="interval" name="interval" value={ parseInt(item.interval)} onValueChange={ handleIntervalChange}>
				  <SelectTrigger className="w-[180px]">
					<SelectValue placeholder="选择抓取频率" />
				  </SelectTrigger>
				  <SelectContent>
					<SelectGroup>
					{data.intervalOptions.map((intervalOption, index) => (
					
					  <SelectItem key={index} value={intervalOption.key}>{intervalOption.label}</SelectItem>
					  ))
					 }			  
					</SelectGroup>
				  </SelectContent>
				</Select>				
				
                
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
			  
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="grade">种子等级</FieldLabel>
                </div>
                <Select id="grade" name="grade" value={ parseInt(item.grade)} onValueChange={ handleGradeChange}>
				  <SelectTrigger className="w-[180px]">
					<SelectValue placeholder="选择种子等级" />
				  </SelectTrigger>
				  <SelectContent>
					<SelectGroup>
					{data.gradeOptions.map((gradeOption, index) => (
					
					  <SelectItem key={index} value={gradeOption.key}>{gradeOption.label}</SelectItem>
					  ))
					 }					  
	  
					</SelectGroup>
				  </SelectContent>
				</Select>				
          
              </Field>	

			<div className="flex items-start gap-3">
				<Checkbox id="useTemplate" name="useTemplate" checked={item.useTemplate} onCheckedChange={handleUseTemplateChange} />
				<div className="grid gap-2">
				  <Label htmlFor="useTemplate">使用采集模板</Label>
				</div>
			  </div>			  
              { item.useTemplate &&
				  <Field>
					<div className="flex items-center">
					  <FieldLabel htmlFor="tcode">模板编码</FieldLabel>
					</div>
					<Input id="tcode" name="tcode" type="text"  value={item.tcode} onChange={handleChange} required />
				  </Field>	
              }				  

             { loaded && !item.useTemplate &&<FeedConfigForm feedConfig={{}} ref={childRef}/>	}
            		  
			  
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
