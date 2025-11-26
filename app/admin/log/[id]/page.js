//import Image from "next/image";
'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
export default function LogDetailPage() {
  const params = useParams()
  const { id } = params;
  const [item, setItem] = useState({
    id:'',
    type: '',
	severity:5,
	message: '',
	location: '',
	hostname: '',
	referer: '',
  });
  
    useEffect(() => {
    fetch('/api/log/'+id)
      .then((res) => res.json())
      .then((data) => {
        setItem({
			id: data.id || '',
			type: data.type || '',
			severity: data.severity ||5,
			message: data.message || '',
			location: data.location || '',
			hostname: data.hostname || '',
			referer: data.referer || '',			
		})
        //setLoading(false)
      })
  }, []);

  return (
    <div className="">
      <main className="">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl"> 日志详情 </CardTitle>
        </CardHeader>
        <CardContent>
          <div><label>类型:</label> <span> {item.type} </span></div>
		  <div><label>级别:</label> <span> {item.severity} </span></div>
		  <div><label>消息:</label> <span> {item.message} </span></div>
		  <div><label>位置:</label> <span> {item.location} </span></div>
		  <div><label>主机:</label> <span> {item.hostname} </span></div>
		  <div><label>来源:</label> <span> {item.referer} </span></div>
        </CardContent>
      </Card>

      </main>

    </div>
  );
}
