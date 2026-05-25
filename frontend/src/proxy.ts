import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('rent_desk_token')?.value;
  const role = request.cookies.get('rent_desk_role')?.value;

  const isAuthRoute = pathname === '/login';
  const isAdminRoute = pathname.startsWith('/admin');
  const isTenantRoute = pathname.startsWith('/tenant');
  const isDashboardRoute = pathname === '/dashboard';
  const isRootRoute = pathname === '/';

  // 1. If user is NOT authenticated
  if (!token) {
    // Block protected areas and redirect to /login
    if (isAdminRoute || isTenantRoute || isDashboardRoute || isRootRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 2. If user IS authenticated, enforce RBAC
  if (token) {
    // If role is admin
    if (role === 'admin') {
      // Admin should only access /admin routes. Redirect away from other pages.
      if (isAuthRoute || isTenantRoute || isDashboardRoute || isRootRoute) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } 
    // If role is tenant
    else if (role === 'tenant') {
      // Tenant should only access /tenant routes. Redirect away from other pages.
      if (isAuthRoute || isAdminRoute || isDashboardRoute || isRootRoute) {
        return NextResponse.redirect(new URL('/tenant', request.url));
      }
    } 
    // Invalid/corrupt role -> Force logout flow via redirecting to login (the login page will clear cookies if token invalid)
    else {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('rent_desk_token');
      response.cookies.delete('rent_desk_role');
      return response;
    }
  }

  return NextResponse.next();
}

// Specify matcher to intercept root, login, dashboard, admin, and tenant routes
export const config = {
  matcher: ['/', '/login', '/dashboard', '/admin/:path*', '/tenant/:path*'],
};
