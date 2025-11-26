import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
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
	  
	  //检查用户是否已经存在
	  let existUser = await prisma.user.findUnique({
		  where: {
			name: name,
		  },		  
	  });
	  
	  if(existUser != null){
		let ret = {
		  error:true,
		  message:"用户名已存在"
		}		
		return new Response(JSON.stringify(ret), { status: 200 })  		  
	  }
		
	  //将密码加密存储
	  const SALT_WORK_FACTOR = 10;
	  let salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
      let hash = bcrypt.hashSync(password, salt);
	  userObject.password = hash;
	  
	  const user = await prisma.user.create({ data: userObject })

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
