// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
 
  console.log(`[Middleware] Allowing access to: ${pathname}`);
  
  
  return NextResponse.next();
}


export const config = {
  matcher: [],
};