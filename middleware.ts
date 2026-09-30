import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dealdisha_super_secret_jwt_key_2026_change_in_prod'
);

const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/logout',
  '/api/auth/me',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static Next.js assets, favicon, and explicit public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    PUBLIC_ROUTES.includes(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('dealdisha_session')?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // If user is authenticated and tries to access /login or /signup, redirect to /
  if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Require authentication for protected routes: /, /dashboard, /leads, /leads/[id], /add-lead, /profile, /settings, etc.
  if (!isAuthenticated) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
