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
import { Textarea } from "@/components/ui/textarea"

import {
  FeedConfigForm,
} from "@/components/feed-config-form"

export default function TemplateImportPage() {
  //const childRef = useRef();

  const [content, setContent] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
	
	
	
    try {
	  let item = JSON.parse(content);
      let label = item.label || "";
	  let code = item.code || "";
	  let config = item.config || null;
	  
	  if(label == "" || code == "" || config == null){
		alert('模板JSON格式有误，不被支持'); 
        return;		
	  }
		
      const response = await fetch('/api/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
			label: item.label,
			code: item.code,
			config:config,
		}),
      });
	  
	  console.log("response", response);
      if (response.ok) {
        alert('表单提交成功!');

		
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
          <CardTitle className="text-xl"> 导入模板</CardTitle>
        </CardHeader>
        <CardContent>
          <form  onSubmit={handleSubmit}>
            <FieldGroup>


              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="content">请粘贴json格式的内容</FieldLabel>
                </div>
                <Textarea id="content" name="content" className="max-h-96" value={content} onChange={(e)=>setContent(e.target.value)}/>
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
