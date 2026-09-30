import { NextResponse } from 'next/server';
import { clearSession, SESSION_COOKIE_NAME } from '../../../../lib/auth';

export async function POST() {
  await clearSession();
  
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  // Explicitly clear session cookie on HTTP response
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
