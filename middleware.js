import { NextResponse } from "next/server";

// Public routes that don't require auth
const PUBLIC_ROUTES = new Set([
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot",
  "/auth/reset",
]);

export function middleware(req) {
  const { pathname, search } = req.nextUrl;

  // Skip static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/public") ||
    pathname.endsWith(".ico")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;
  const isPublic = PUBLIC_ROUTES.has(pathname);

  // If not authenticated and not public -> redirect to login with next param
  if (!token && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    const next = pathname + (search || "");
    url.search = `?next=${encodeURIComponent(next)}`;
    return NextResponse.redirect(url);
  }

  // If authenticated and on public route, let SSR page handle redirect or just continue
  return NextResponse.next();
}

// Apply middleware to all routes except assets and API (basic glob)
export const config = {
  matcher: "/((?!_next|api|static|public|favicon.ico).*)",
};
