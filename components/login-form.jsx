'use client'
import React, { useState,useActionState } from 'react';
//import { login } from '@/app/actions/auth'
import { cn } from "@/lib/utils"
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

export function LoginForm({
  className,
  loginAction,
  ...props 
}) {
  const [state, action, pending] = useActionState(loginAction, {
		//success:false,
		name:"",
		password:"",
		message:""		
	});
  console.log("state", state);
  /*
  const [item, setItem] = useState({
    name: '',
    password: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
	
	let newItem = {
      ...item,
      [name]: value
    };
	console.log("newItem", newItem);
    setItem(newItem);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
	
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
		  name: item.name,
		  password: item.password,
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

			//window.location.href = '/admin/feed';
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
	*/
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Next Crawler</CardTitle>

        </CardHeader>
        <CardContent>
          <form action={action}>
            <FieldGroup>
              <div> {state?.message && <p>{state.message}</p>}</div>
              <Field>
                <FieldLabel htmlFor="name">用户名</FieldLabel>
                <Input id="name" name="name" defaultValue={state?.name} type="text" required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">密码</FieldLabel>
                </div>
                <Input id="password" name="password" defaultValue={state?.name} type="password" required />
              </Field>
              <Field>
                <Button disabled={pending} type="submit">登录</Button>

              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

    </div>
  );
}
