import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  
  // Get hostname of request (e.g. kswms.kswtechzone.com.np, glamstudio.kswtechzone.com.np)
  const hostname = req.headers.get('host') || '';

  // Determine if we are running on localhost
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

  // Define our central management dashboard domain
  const isManagement = hostname === 'kswtechzone.com.np' || hostname === 'ms.kswtechzone.com.np' || hostname === 'kswms.kswtechzone.com.np' || (isLocalhost && hostname.startsWith('localhost:3000'));

  // Exclude static files, nextjs internal files, and API routes from middleware rewrites
  if (url.pathname.startsWith('/_next') || url.pathname.startsWith('/api') || url.pathname.includes('.')) {
    return NextResponse.next();
  }

  // Route to the administrative dashboard
  if (isManagement) {
    // If it's explicitly the dashboard, we don't need to rewrite, just pass through.
    // Assuming the main Next.js app handles /dashboard, /login, /admin natively in app router
    return NextResponse.next();
  } else {
    // It's a tenant website (e.g. glamstudio.kswtechzone.com.np)
    // Extract the subdomain
    const subdomain = isLocalhost ? hostname.split('.')[0] : hostname.replace('.kswtechzone.com.np', '').replace('.kswtechzone.com.np', '');
    
    // Ignore reserved platform subdomains routing to tenant sites just in case
    if (['kswms', 'ms', 'api', 'www', 'admin'].includes(subdomain)) {
        return NextResponse.next();
    }
    
    // Rewrite traffic to dynamic tenant site renderers under /site/[slug]
    // The Next.js app needs to have an app/site/[slug]/page.tsx route
    return NextResponse.rewrite(new URL(`/site/${subdomain}${url.pathname}`, req.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
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
