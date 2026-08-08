import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Both the login page and the login API route must stay reachable
  // without a session — otherwise you could never log in.
  if (path === "/admin/login" || path === "/api/admin/login") {
    return NextResponse.next();
  }

  const session = request.cookies.get("admin_session");

  if (session?.value !== process.env.ADMIN_PASSWORD) {
    // API routes should get a 401, not a redirect (a fetch() call
    // can't "follow" a redirect to an HTML login page usefully).
    if (path.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
