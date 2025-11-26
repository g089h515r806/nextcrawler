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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
const data = {

  fetchStatusOptions: [
    //{key: "none", label: "None",},
    {key: "0", label: "未抓取",},
	{key: "1", label: "抓取成功",},
	{key: "2", label: "抓取失败",},
  ],

  gradeOptions: [
    //{key: "none", label: "None",},
    {key: "1", label: "A, 优秀",},
	{key: "2", label: "B, 一般",},
	{key: "3", label: "C, 较差",},
	{key: "4", label: "D, 废弃",},
  ],  
}

export default function FeedSearchForm({ className }) {
  
  const searchParams = useSearchParams()
 
  const defaultLabel = searchParams.get('label') || ""
  const defaultUrl = searchParams.get('url') || ""
  const defaultFetchStatus = searchParams.get('fetchStatus') || ""
  const defaultGrade = searchParams.get('grade') || ""
  
  console.log("defaultGrade", defaultGrade);
  //const [query, setQuery] = useState(defaultQuery);
  const [label, setLabel] = useState(defaultLabel);
  const [url, setUrl] = useState(defaultUrl);
  
  const [fetchStatus, setFetchStatus] = useState(defaultFetchStatus);
  const [grade, setGrade] = useState(defaultGrade);
  
  const handleSearch = async (e) => {
    e.preventDefault();
	/*
	let preUrl = '/admin/feed?';
	//if(label != ''){
		preUrl = preUrl + "label=" + label;
	//}
	if(url != ''){
		preUrl = preUrl + "&url=" + url;
	}
	if(fetchStatus != ''){
		preUrl = preUrl + "&fetchStatus=" + fetchStatus;
	}
	if(grade != ''){
		preUrl = preUrl + "&grade=" + grade;
	}
*/	
	window.location.href = '/admin/feed?label=' + label + "&url=" + url + "&fetchStatus=" + fetchStatus + "&grade=" + grade;

  };  
	
  return (
    <div className={cn("flex flex-col gap-6 w-full", className)} >
      <Card>
        <CardContent>
            <FieldGroup  className="flex flex-row">
              <Field>
                <FieldLabel htmlFor="label">标签</FieldLabel>
                <Input id="label" type="text" value={ label } onChange={(e) => setLabel(e.target.value)} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="url">网址</FieldLabel>
                <Input id="url" type="text" value={ url } onChange={(e) => setUrl(e.target.value)} required />
              </Field>
 
			  
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="fetchStatus">抓取状态</FieldLabel>
                </div>
                <Select id="fetchStatus" name="fetchStatus" value={ fetchStatus} onValueChange={ setFetchStatus}>
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
                <Select id="grade" name="grade" value={ grade} onValueChange={ setGrade}>
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

             <Field>
                <Button className="mt-8" onClick={ handleSearch }>搜索</Button>
              </Field>			  
			  
            </FieldGroup>

        </CardContent>
      </Card>

    </div>
  );
}
