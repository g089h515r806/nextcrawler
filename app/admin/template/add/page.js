//import Image from "next/image";
'use client'
import React, { useState, useRef } from 'react';
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
  FeedConfigForm,
} from "@/components/feed-config-form"

export default function TemplateAddPage() {
  const childRef = useRef();

  const [item, setItem] = useState({
    label: '',
    code: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
	
	let feedConfig = childRef.current.getValue();
	console.log("feedConfig", feedConfig);	
    try {
      const response = await fetch('/api/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
			label: item.label,
			code: item.code,
			config:feedConfig,
		}),
      });
	  
	  console.log("response", response);
      if (response.ok) {
        alert('表单提交成功!');
        // 重置表单或进行其他操作
        setItem({ label: '', code: '' });
		
		//window.history.replaceState(null, '', '/proxies');
		window.location.href = '/admin/template';
      } else {
        alert('表单提交失败.');
      }
    } catch (error) {
      console.error('提交表单时出错:', error);
      alert('表单提交失败.');
    }
  };
  


  return (
    <div className="font-sans">
      <main className="">

   
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl"> 添加模板</CardTitle>
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
                  <FieldLabel htmlFor="code">编码</FieldLabel>
                </div>
                <Input id="code" name="code" type="text"  value={item.code} onChange={handleChange} required />
              </Field>

               <FeedConfigForm feedConfig={{}} ref={childRef}/>			  
			  
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
