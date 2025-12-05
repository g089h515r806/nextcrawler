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

export default function TestUrlPage()  {

  const [item, setItem] = useState({
    url: '',
    timeout: 60000,
  });
  
  const [status, setStatus] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
	
	let newItem = {
      ...item,
      [name]: value
    };
	//console.log("newItem", newItem);
    setItem(newItem);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/testurl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
			url: item.url,
			timeout: parseInt(item.timeout),		  
		}),
      });
	  
	  console.log("response", response);
      if (response.ok) {
        alert('表单提交成功!');
        // 重置表单或进行其他操作
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
          <CardTitle className="text-xl"> 测试URL </CardTitle>
        </CardHeader>
        <CardContent>
          <form  onSubmit={handleSubmit}>
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="url">URL</FieldLabel>
                <Input
                  id="url"
				  name="url"
                  type="text"
				  value={item.url}
				  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="timeout">超时时间</FieldLabel>
                </div>
                <Input id="timeout" name="timeout" type="text"  value={item.timeout} onChange={handleChange} required />
              </Field>
		  
			  
              <Field>
                <Button type="submit">测试</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>


      </main>

    </div>
  );
}
