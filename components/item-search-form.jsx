'use client'
import { cn } from "@/lib/utils"
import React, { useState } from "react";
import { useSearchParams } from 'next/navigation'
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

export default function ItemSearchForm({ className }) {
  
  const searchParams = useSearchParams()
 
  const defaultTitle = searchParams.get('title') || ""
  const defaultUrl = searchParams.get('url') || ""
  //const [query, setQuery] = useState(defaultQuery);
  const [title, setTitle] = useState(defaultTitle);
  const [url, setUrl] = useState(defaultUrl);
  
  const handleSearch = async (e) => {
    e.preventDefault();
	window.location.href = '/admin/item?title=' + title + "&url=" + url;
  };  
	
  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} >
      <Card>
        <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">标题</FieldLabel>
                <Input id="title" type="text" value={ title } onChange={(e) => setTitle(e.target.value)} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="url">网址</FieldLabel>
                <Input id="url" type="text" value={ url } onChange={(e) => setUrl(e.target.value)} required />
              </Field>
              <Field>
                <Button onClick={ handleSearch }>搜索</Button>
              </Field>
            </FieldGroup>

        </CardContent>
      </Card>

    </div>
  );
}
