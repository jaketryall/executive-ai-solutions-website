import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Set this to false when you want to disable maintenance mode
const MAINTENANCE_MODE = true;

export function middleware(request: NextRequest) {
  // If maintenance mode is enabled
  if (MAINTENANCE_MODE) {
    const { pathname } = request.nextUrl;

    // Allow access to maintenance page, static files, and API routes
    if (
      pathname === "/maintenance" ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.includes(".") // static files like images, fonts, etc.
    ) {
      return NextResponse.next();
    }

    // Redirect all other routes to maintenance page
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
