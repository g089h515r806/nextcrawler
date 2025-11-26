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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function UserAddPage() {
  const [item, setItem] = useState({
    name: '',
    password: '',
	password1: '',
  });
  
  const [status, setStatus] = React.useState(false);

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
	
	if(item.password != item.password1){
	  alert("密码必须一致");
	  return;
	}
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
		//credentials: "same-origin",
        body: JSON.stringify({
		  name: item.name,
		  password: item.password,
		  status:status
		}),
      });
	  
	  console.log("response", response);
      if (response.ok) {
		let data = await response.json();
		console.log("data", data);		
		let error = data.error || false;
		if(error){
			let message = data.message || "提交出现错误";
			alert(message);
		}else{
			alert('表单提交成功!');

			window.location.href = '/admin/user';
		}
      } else {
        alert('表单提交失败.');
      }
    } catch (error) {
	  console.log("error", error);	
      //console.log('提交表单时出错:', error);
      alert('表单提交失败.');
    }
  };


  return (
    <div className="">
      <main className="">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl"> 添加用户 </CardTitle>
        </CardHeader>
        <CardContent>
          <form  onSubmit={handleSubmit}>
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="name">用户名</FieldLabel>
                <Input
                  id="name"
				  name="name"
                  type="text"
				  value={item.name}
				  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">密码</FieldLabel>
                </div>
                <Input id="password" name="password" type="text"  value={item.password} onChange={handleChange} required />
              </Field>
			  
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password1">确认密码</FieldLabel>
                </div>
                <Input id="password1" name="password1" type="text"  value={item.password1} onChange={handleChange} required />
              </Field>			  
			  
				<div className="flex items-start gap-3">
					<Checkbox id="status" name="status" checked={status} onCheckedChange={setStatus} />
					<div className="grid gap-2">
					  <Label htmlFor="status">状态</Label>
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
