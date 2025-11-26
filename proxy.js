import { NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'
 
export default async function proxy(req) {  
  const authorization = process.env.AUTHORIZATION || "";
  
  //只有设置为true时，才进行检查；否则直接下一步
  if(authorization != "true"){
	return NextResponse.next()
  }
  
  const path = req.nextUrl.pathname
  // Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  console.log("path", path);
  
  // 如果没有认证，api页面直接返回错误
  if (authorization == "true" && path.startsWith('/api') && !session?.userId) {
    //return NextResponse.redirect(new URL('/login', req.nextUrl))
	console.log("path1", path);
	return new NextResponse(null, { status: 500 })
  }  
 
  // Redirect to /login if the user is not authenticated
  if (authorization == "true" && path.startsWith('/admin') && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
// Routes Proxy should not run on
export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
}