'use client'
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'
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

export default function ProxyEditPage() {
  //const { id } = await params
  const params = useParams()
  const { id } = params;
  const [item, setItem] = useState({
    id:'',
    label: '',
    server: '',
	username: '',
	password: '',
	//status: false,
  });
  
  const [status, setStatus] = React.useState(false);

  const handleChange = (e) => {
    const target = e.target;
	console.log("e", e);
	console.log("target", target);
    //const value = target.type === 'checkbox' ? target.checked : target.value;
	const value = target.value;
    const name = target.name;  
    //const { name, value } = e.target;
	
	console.log("name", name);
	console.log("value", value);
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
      const response = await fetch('/api/proxy/'+id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
		  ...item,
		  status:status
		}),
      });
	  
	  console.log("response", response);
      if (response.ok) {
        alert('表单提交成功!!');
        // 重置表单或进行其他操作
        setItem({ id:'', label: '', url: '' });
		
		//window.history.replaceState(null, '', '/proxies');
		window.location.href = '/admin/proxy';
      } else {
        alert('表单提交失败.');
      }
    } catch (error) {
      console.error('提交表单时出错:', error);
      alert('表单提交失败.');
    }
  };
  
  useEffect(() => {
    fetch('/api/proxy/'+id)
      .then((res) => res.json())
      .then((data) => {
	  console.log("data", data);
        setItem({
			id: data.id || '',
			label: data.label || '',
			//url: data.url || '',
			server: data.server || '',
	        username: data.username || '',
	        password: data.password || '',
			//status: data.status || false,			
		})
        setStatus(data.status || false);	
        //setLoading(false)
      })
  }, []);

  return (
    <div className="">
      <main className="">
        <h2>Proxy edit page </h2>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl"> 编辑代理 </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
                  <FieldLabel htmlFor="server">代理服务器</FieldLabel>
                </div>
                <Input id="server" name="server" type="text"  value={item.server} onChange={handleChange} required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="username">用户名</FieldLabel>
                </div>
                <Input id="username" name="username" type="text"  value={item.username} onChange={handleChange} required />
              </Field>	
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">密码</FieldLabel>
                </div>
                <Input id="password" name="password" type="text"  value={item.password} onChange={handleChange} required />
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
