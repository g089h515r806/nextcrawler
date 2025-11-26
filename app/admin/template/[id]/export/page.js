//import Image from "next/image";
'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'
//import { cn } from "@/lib/utils"
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
import { Textarea } from "@/components/ui/textarea"

export default function TemplateEditPage() {

  const params = useParams()
  const { id } = params;

  const [content, setContent] = useState("");

  useEffect(() => {
    fetch('/api/template/'+id)
      .then((res) => res.json())
      .then((data) => {
	  console.log("data", data);
	  
	  let item = {
		label: data.label || '',
		code: data.code || '',
		config:data.config || {},		  
	  };
	  
	  //JSON.stringify(item)
	  setContent(JSON.stringify(item, null, 4))

      })
  }, []);  

  return (
    <div className="font-sans">
      <main className="">

   
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">导出模板 </CardTitle>
        </CardHeader>
        <CardContent>

            <FieldGroup>


              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="content">JSON模板</FieldLabel>
                </div>
                <Textarea id="content" name="content" className="max-h-96" value={content} readOnly/>
              </Field>			  
			  
            </FieldGroup>

        </CardContent>
      </Card>


      </main>

    </div>
  );
}
