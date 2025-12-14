import { NextResponse } from 'next/server'


export async function GET(request) {
  try {
    // redirect to '/admin/feed'
	return NextResponse.redirect(new URL('/admin/feed', request.nextUrl))
  }catch (err) {
    console.log("err", err);
	return new Response(null, { status: 500 })
  }
}

