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

function isTokenValid(token: string | undefined | null): boolean {
  if (!token || typeof token !== "string") return false;
  const trimmed = token.trim();
  if (
    trimmed === "" ||
    trimmed === "undefined" ||
    trimmed === "null" ||
    trimmed === "false" ||
    trimmed === "NaN"
  ) {
    return false;
  }

  // Legacy session token format: sess_<user_id>_<hex>
  if (trimmed.startsWith("sess_")) {
    return trimmed.length >= 15;
  }

  // Standard JWT validation: header.payload.signature
  const parts = trimmed.split(".");
  if (parts.length === 3) {
    try {
      // Decode JWT payload
      const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const jsonStr = atob(payloadBase64);
      const payload = JSON.parse(jsonStr);

      // Check token expiration if exp claim is present
      if (typeof payload.exp === "number") {
        const nowSec = Math.floor(Date.now() / 1000);
        if (payload.exp < nowSec) {
          // Token is expired
          return false;
        }
      }

      // Check subject/identity presence
      return Boolean(payload.sub || payload.id || payload.user_id || payload.email);
    } catch {
      return false;
    }
  }

  // Valid non-empty token string
  return trimmed.length >= 10;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const rawToken = request.cookies.get("zobayrank_auth_token")?.value;
  const tokenValid = isTokenValid(rawToken);

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const isAuthPage = AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );

  // 1. Unauthenticated or invalid/expired session attempting to access protected route
  if (isProtected && !tokenValid) {
    const returnPath = `${pathname}${search}`;
    const loginUrl = new URL(`/login?redirect=${encodeURIComponent(returnPath)}`, request.url);
    const response = NextResponse.redirect(loginUrl);
    // Erase any invalid/expired/stale cookies
    response.cookies.delete("zobayrank_auth_token");
    response.cookies.delete("dmos_auth_token");
    return response;
  }

  // 2. Already authenticated user trying to access login/signup pages
  if (isAuthPage && tokenValid) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  // 3. User on auth page with an invalid/expired token: clear the bad cookie
  if (isAuthPage && !tokenValid && rawToken) {
    const response = NextResponse.next();
    response.cookies.delete("zobayrank_auth_token");
    response.cookies.delete("dmos_auth_token");
    return response;
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
