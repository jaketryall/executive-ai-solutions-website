import { NextResponse, type NextRequest } from "next/server";

// Persist the ad-campaign industry (?ind=) into a sticky cookie at the edge,
// so the campaign-matched hero survives internal navigation and return visits
// — not just the initial ad click. Geo is read straight from Vercel's request
// headers in the Server Component, so it needs no middleware here.
export function middleware(req: NextRequest) {
  const ind = req.nextUrl.searchParams.get("ind");
  const res = NextResponse.next();
  if (ind) {
    res.cookies.set("eas_ind", ind.toLowerCase(), {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
      sameSite: "lax",
    });
  }
  return res;
}

export const config = {
  // Run on pages only — skip API routes and Next internals/assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
