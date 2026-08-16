/* "@airdev/next": "managed" */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { HEADER_URL_KEY } from './airdev/common/constant';

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    HEADER_URL_KEY,
    request.nextUrl.pathname + request.nextUrl.search
  );

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
