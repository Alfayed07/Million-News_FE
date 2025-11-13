import { NextResponse } from "next/server";

// Public routes that don't require auth
const PUBLIC_ROUTES = new Set([
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot",
  "/auth/reset",
]);

export async function middleware(req) {
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

  // Role-based gate for admin areas
  if (token && pathname.startsWith("/admin")) {
    const requireAdminOnly = pathname.startsWith("/admin/users");
    const requireAdminOrEditor = pathname.startsWith("/admin/news");

    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "http://localhost:8070";
    try {
      const resp = await fetch(`${apiBase}/user/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) {
        // token invalid -> send to login
        const url = req.nextUrl.clone();
        url.pathname = "/auth/login";
        const next = pathname + (search || "");
        url.search = `?next=${encodeURIComponent(next)}`;
        return NextResponse.redirect(url);
      }
      const data = await resp.json();
      const role = (data?.role || data?.user?.role || "").toLowerCase();
      if (requireAdminOnly && role !== "admin") {
        const url = req.nextUrl.clone();
        url.pathname = "/home";
        url.search = "";
        return NextResponse.redirect(url);
      }
      if (requireAdminOrEditor && role !== "admin" && role !== "editor") {
        const url = req.nextUrl.clone();
        url.pathname = "/home";
        url.search = "";
        return NextResponse.redirect(url);
      }
    } catch (e) {
      // Network or other error -> allow SSR to handle but default to safe redirect
      const url = req.nextUrl.clone();
      url.pathname = "/home";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // If authenticated and on public route, let SSR page handle redirect or just continue
  return NextResponse.next();
}

// Apply middleware to all routes except assets and API (basic glob)
export const config = {
  matcher: "/((?!_next|api|static|public|favicon.ico).*)",
};
