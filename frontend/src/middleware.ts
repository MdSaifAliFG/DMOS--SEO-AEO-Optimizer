import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected route paths requiring authentication
const PROTECTED_PREFIXES = [
  "/overview",
  "/dashboard",
  "/seo",
  "/aeo",
  "/geo",
  "/projects",
  "/keywords",
  "/competitors",
  "/integrations",
  "/settings",
  "/billing",
  "/notifications",
  "/aeo-insights",
];

// Public authentication pages (redirect to /overview if already authenticated)
const AUTH_PAGES = ["/login", "/signup", "/register"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const authToken = request.cookies.get("zobayrank_auth_token")?.value;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const isAuthPage = AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );

  // 1. Unauthenticated visitor trying to access a protected application route
  if (isProtected && !authToken) {
    const returnPath = `${pathname}${search}`;
    const loginUrl = new URL(`/login?redirect=${encodeURIComponent(returnPath)}`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Already authenticated user trying to access login/signup pages
  if (isAuthPage && authToken) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - API routes (/api/...)
     * - Next.js internal static assets (_next/static, _next/image)
     * - Static public files (images, icons, robots.txt, sitemap.xml)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
