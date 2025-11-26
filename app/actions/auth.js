'use server'
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
//import { NextResponse, NextRequest } from 'next/server'
import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/session'
 
export async function login(state, formData) {
  // Previous steps:
	//const userObject = await request.json(); 
	
	console.log("state", state);
	
	console.log("formData", formData);

	let name = formData.get('name');
	let password = formData.get('password');
	
	
	state ={
		//success:false,
		name:name,
		password:password,
		message:""		
	} 	
	
	console.log("name", name);
	if(name == "" || password == ""){
		//直接返回错误，简单处理
        state.message = "用户名、密码不能为空"		
		return  state;
	}  
  
	let existUser = await prisma.user.findUnique({
		  where: {
			name: name,
		  },		  
	});
	console.log("existUser", existUser); 
	
	if(existUser == null){

        state.message = "用户名不存在"		
		return state;		  
	} 

    let pswdHash = existUser.password || '';
	console.log("pswdHash", pswdHash); 
    if (pswdHash == '') {

		state.message = "密码有问题"		
		return state
    }
	  
    let valid = bcrypt.compareSync(password, pswdHash);
	  
	if(!valid){
        state.message = "密码有问题"		
		return  state ; 
	  
	}	
  // 1. Validate form fields
  // 2. Prepare data for insertion into database
  // 3. Insert the user into the database or call an Library API
 
  // Current steps:
  // 4. Create user session
    await createSession(existUser.id)
  // 5. Redirect user
   redirect('/admin/feed');
}


export async function logout(state, formData) {
   await deleteSession();
   redirect('/login');
}