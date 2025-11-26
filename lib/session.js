//import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import prisma from './prisma.js';
 
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
 
export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}
 
export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}

 
export async function createSession(userId) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()
 
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)
 
  if (!session || !payload) {
    return null
  }
 
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)(
    await cookies()
  ).set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}


export async function checkAuthorization() {
  const authorization = process.env.AUTHORIZATION || "";	
  //不需要认证，直接返回true,不限制
  if(authorization != "true"){
	return true;  
  }
  
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  if (!session?.userId) {
    //return NextResponse.redirect(new URL('/login', req.nextUrl))
	return false;
  }

  return true;
}


export async function getSessionUser() {
  //const authorization = process.env.AUTHORIZATION || "";	
  //不需要认证，直接返回true,不限制
  //if(authorization != "true"){
	//return null;  
  //}
  
	const cookie = (await cookies()).get('session')?.value
	// console.log('cookie', cookie)
	 
	const session = await decrypt(cookie)
	let userId =  session?.userId || "";
	// console.log('userId', userId)
	if (userId == "") {
		//return NextResponse.redirect(new URL('/login', req.nextUrl))
		return null;
	}
  
	let user = await prisma.user.findUnique({
	  where: {
		id: parseInt(userId),
	  },
	})  
    delete user.password;
	// console.log('user', user)
    return user;
}


 