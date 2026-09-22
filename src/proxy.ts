import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per minute for sensitive routes

const ipLimits = new Map<string, { count: number; lastReset: number }>();

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Apply rate limiting to sensitive routes like login and register
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Prevent memory leaks by resetting the map if it grows too large
    if (ipLimits.size > 10000) {
      ipLimits.clear();
    }
    
    const now = Date.now();
    const limitData = ipLimits.get(ip);
    
    if (limitData) {
      if (now - limitData.lastReset > RATE_LIMIT_WINDOW_MS) {
        ipLimits.set(ip, { count: 1, lastReset: now });
      } else {
        limitData.count++;
        if (limitData.count > MAX_REQUESTS_PER_WINDOW) {
          return new NextResponse('Too Many Requests. Please try again later.', { status: 429 });
        }
      }
    } else {
      ipLimits.set(ip, { count: 1, lastReset: now });
    }
  }

  // Update supabase session
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
