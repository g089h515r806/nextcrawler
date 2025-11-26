import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request,{ params }) {
	try {
		const { id } = await params
		const user = await prisma.user.findUnique({
		  where: {
			id: parseInt(id),
		  },
		})
		//console.log("user", user);
		//删除用户的密码字段
		delete user.password;
		
		return new Response(JSON.stringify(user), { status: 200 })
		//return new Response.json(proxy);
	}catch (err) {
      //ctx.throw(422);
	  return new Response(null, { status: 500 })
    }
  //const res = await request.json()
  
}


export async function PATCH(request, { params }) {
  try {
	const userObject = await request.json();
	const { id } = await params;
	  
	if(id == ''){
		let ret = {
		  error:true,
		  message:"id不能为空"
		}		
		return new Response(JSON.stringify(ret), { status: 200 })  
	}
	
	let password = userObject.password || "";
	let name = userObject.name || "";		  
	if(name == ""){
		//直接返回错误，简单处理
		let ret = {
		  error:true,
		  message:"用户名不能为空"
		}		
		return new Response(JSON.stringify(ret), { status: 200 })  
	}
	
	//用户名不能与其它用户同名
    let existUser = await prisma.user.findFirst({
	  where: {
		name: name,
		id: {not: parseInt(id)},
	  },		  
    });
	  
	if(existUser != null){
		let ret = {
		  error:true,
		  message:"用户名已存在"
		}		
		return new Response(JSON.stringify(ret), { status: 200 })  		  
	}	
	  
    let updateData = {
	  name: userObject.name || '',
	  status: userObject.status || false,
	}
    //更新密码
    if(password != ""){	
	  //将密码加密存储
	  const SALT_WORK_FACTOR = 10;
	  let salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
      let hash = bcrypt.hashSync(password, salt);
	  updateData.password = hash;	
	}
	
	const updateUser = await prisma.user.update({
	  where: {
		id: parseInt(id),
	  },
	  data: updateData,
	})
	
	let ret = {
		error:false,
		message:"success"
	}		
	return new Response(JSON.stringify(ret), { status: 200 })		
	 
  }catch (err) {
    console.log("err", err);
	return new Response(null, { status: 500 })
  }
}


export async function DELETE(request, { params }) {
  try {
	  //const proxyObject = await request.json();
	  const { id } = await params;
	 
	  if(id != ''){
		const updateUser = await prisma.user.delete({
		  where: {
			id: parseInt(id),
		  },
		})
         return new Response(null, { status: 204 })		
	  }else{
	      return new Response(null, { status: 500 })
	  }
	  
	  //const proxy = await prisma.proxy.create({ data: proxyObject })
	  //https://www.prisma.io/docs/orm/prisma-client/queries/crud
	  
	  //return Response.json(proxy)
	 
  }catch (err) {
      //ctx.throw(422);
	  return new Response(null, { status: 500 })
  }
}