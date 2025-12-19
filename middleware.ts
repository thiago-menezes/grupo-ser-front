import { NextRequest, NextResponse } from 'next/server';

// Map domains to institution slugs
const DOMAIN_TO_INSTITUTION: Record<string, string> = {
  'unama.com.br': 'unama',
  'www.unama.com.br': 'unama',
  'uninassau.com.br': 'uninassau',
  'www.uninassau.com.br': 'uninassau',
  'ung.edu.br': 'ung',
  'www.ung.edu.br': 'ung',
  'uninorte.com.br': 'uninorte',
  'www.uninorte.com.br': 'uninorte',
  'unifael.edu.br': 'unifael',
  'www.unifael.edu.br': 'unifael',
  'uni7.edu.br': 'uni7',
  'www.uni7.edu.br': 'uni7',
  // Fallback for development
  'localhost:3000': 'grupo-ser',
  localhost: 'grupo-ser',
};

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static assets, API routes, and internal Next.js routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get institution from domain
  const institution = DOMAIN_TO_INSTITUTION[host];

  if (institution) {
    // If path doesn't start with institution, we need to inject it
    // This maintains compatibility with path-based routing during transition
    const response = NextResponse.next();

    // Set cookie with institution for client-side access
    response.cookies.set('institution', institution, {
      path: '/',
      sameSite: 'lax',
      // Don't set httpOnly so client can read it
    });

    // Add custom header for server components
    response.headers.set('x-institution', institution);

    return response;
  }

  // If no domain match, continue normally (path-based routing)
  return NextResponse.next();
}

export const config = {
  // Match all paths except static files and API routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
