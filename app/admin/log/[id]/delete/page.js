//import Image from "next/image";
'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LogDeletePage() {

  const params = useParams()
  const { id } = params;
  const [item, setItem] = useState({
    id:'',
    type: '',
	message: '',
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/log/'+id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
	  
	  console.log("response", response);
      if (response.ok) {
        alert('表单提交成功!');
        // 重置表单或进行其他操作
        //setItem({ label: '', url: '' });
		
		//window.history.replaceState(null, '', '/proxies');
		window.location.href = '/admin/log';
      } else {
        alert('表单提交失败.');
      }
    } catch (error) {
      console.error('提交表单时出错:', error);
      alert('表单提交失败.');
    }
  };
  
  useEffect(() => {
    fetch('/api/log/'+id)
      .then((res) => res.json())
      .then((data) => {
        setItem({
			id: data.id || '',
			type: data.type || '',
			message: data.message || '',			
		})
        //setLoading(false)
      })
  }, []);


  return (
    <div className="">
      <main className="">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl"> 删除日志 </CardTitle>
        </CardHeader>
        <CardContent>
          <form>
		     <p>你确定要删除下面的日志么：</p>
			 <p>{item.message}</p>
               <Link href="/admin/log">取消</Link>  <Button type="submit" onClick={handleSubmit}>删除</Button>
          </form>
        </CardContent>
      </Card>

      </main>

    </div>
  );
}
