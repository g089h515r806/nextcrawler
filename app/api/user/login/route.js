import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  let jwtSecret = "123456";
  try {
	  const userObject = await request.json();
	  let password = userObject.password || "";
	  let name = userObject.name || "";
	  

	  
	  if(name == "" || password == ""){
		//直接返回错误，简单处理
		let ret = {
		  error:true,
		  message:"用户名、密码不能为空"
		}		
		return new Response(JSON.stringify(ret), { status: 200 })  
	  }
	  
	  //let existUser = await User.findOne({ name: name});	  
	  //if(pswd)
	  let existUser = await prisma.user.findUnique({
		  where: {
			name: name,
		  },		  
	  });
	  
	  if(existUser == null){
		let ret = {
		  error:true,
		  message:"用户名不存在"
		}		
		return new Response(JSON.stringify(ret), { status: 200 })  		  
	  }
	  

      let pswdHash = existUser.password || '';
      if (pswdHash == '') {
		let ret = {
		  error:true,
		  message:"密码有问题"
		}		
		return new Response(JSON.stringify(ret), { status: 200 }) 
      }
	  
      let valid = bcrypt.compareSync(password, pswdHash);
	  
	  if(!valid){
		let ret = {
		  error:true,
		  message:"密码有问题"
		}		
		return new Response(JSON.stringify(ret), { status: 200 }) 	  
	  
	  }

	  
	  //return Response.json(proxy)
	  let ret = {
		  error:false,
		  message:"success",
		  token: jwt.sign(
			{
			  id: existUser.id,
			  name: existUser.name,
			},
			jwtSecret,
            { expiresIn: 14400 }
			//{ expiresIn: 120 }
		  ),
	  }	  
	  return new Response(JSON.stringify(ret), { status: 200 })
  }catch (err) {
      console.log("err", err);
	  return new Response(null, { status: 500 })
  }
}
