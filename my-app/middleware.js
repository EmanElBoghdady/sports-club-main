import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // قراءة الـ role من الكوكيز
  const userRole = request.cookies.get('user_role')?.value;

  console.log(`[Middleware] Path: ${pathname}, Role: ${userRole}`);

  // 1. إذا كان المستخدم مسجل دخول بالفعل ويحاول دخول صفحة الـ Login
  if (pathname === '/login' && userRole) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. حماية مسارات الداشبورد
  if (pathname.startsWith('/dashboard')) {
    // لو مفيش توكن/رول (غير مسجل دخول)
    if (!userRole) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // منع الـ fan من دخول صفحات الأدمن (اختياري حسب رغبتك)
    // حالياً الكود يسمح للـ fan بدخول /dashboard ولكن الـ Sidebar سيفلتر المحتوى
  }

  return NextResponse.next();
}

export const config = {
  // مراقبة الداشبورد وصفحة اللوجين
  matcher: ['/dashboard/:path*', '/login'],
};