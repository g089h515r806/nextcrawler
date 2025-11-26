//import Image from "next/image";
'use client'
import React, { useState } from 'react';
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

// This is options data for select option.
const data = {
  
  fetchStatusOptions: [
    //{key: "none", label: "None",},
    {key: 0, label: "未抓取",},
	{key: 1, label: "抓取成功",},
	{key: 2, label: "抓取失败",},
  ],
  
}

export default function ListpageAddPage() {

  const [item, setItem] = useState({
    url: '',
	feedId: '',
	//interval: 0,
	fetchStatus: 0,
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
      const response = await fetch('/api/listpage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
		  url: item.url,
		  feedId: parseInt(item.feedId),
		  //interval:item.interval,
		  fetchStatus:item.fetchStatus,	  
		}),
      });
	  
	  console.log("response", response);
      if (response.ok) {
        alert('表单提交成功!');
        // 重置表单或进行其他操作
        setItem({ url: '', feedId: '', interval: 0, fetchStatus: 0, });
		
		//window.history.replaceState(null, '', '/proxies');
		window.location.href = '/admin/listpage';
      } else {
        alert('表单提交失败.');
      }
    } catch (error) {
      console.error('提交表单时出错:', error);
      alert('表单提交失败.');
    }
  };


  return (
    <div className="">
      <main className="">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl"> 添加分页 </CardTitle>
        </CardHeader>
        <CardContent>
          <form  onSubmit={handleSubmit}>
            <FieldGroup>


              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="url">网址</FieldLabel>
                </div>
                <Input id="url" name="url" type="text"  value={item.url} onChange={handleChange} required />
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
