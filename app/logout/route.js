import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/session'
//import { redirect } from 'next/navigation';

export async function GET(request) {
  try {
	  
    await deleteSession();
   // redirect('/login'); 
	return NextResponse.redirect(new URL('/login', request.nextUrl))
	//return new Response(JSON.stringify(config), { status: 200 })
  }catch (err) {
    console.log("err", err);
    //ctx.throw(422);
	return new Response(null, { status: 500 })
  }
}

