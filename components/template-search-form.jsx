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

export default function TemplateSearchForm({ className }) {
  
  const searchParams = useSearchParams()
 
  const defaultLabel = searchParams.get('label') || ""
  const defaultCode = searchParams.get('code') || ""
  //const [query, setQuery] = useState(defaultQuery);
  const [label, setLabel] = useState(defaultLabel);
  const [code, setCode] = useState(defaultCode);
  
  const handleSearch = async (e) => {
    e.preventDefault();
	window.location.href = '/admin/template?label=' + label + "&code=" + code;

  };  
	
  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} >
      <Card>
        <CardContent>
            <FieldGroup className="flex flex-row">
              <Field>
                <FieldLabel htmlFor="label">标签</FieldLabel>
                <Input id="label" type="text" value={ label } onChange={(e) => setLabel(e.target.value)} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="code">编码</FieldLabel>
                <Input id="code" type="text" value={ code } onChange={(e) => setCode(e.target.value)} required />
              </Field>
              <Field>
                <Button className="mt-8" onClick={ handleSearch }>搜索</Button>
              </Field>
            </FieldGroup>

        </CardContent>
      </Card>

    </div>
  );
}
