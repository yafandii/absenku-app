import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieName = process.env.NEXT_PUBLIC_ID_COOKIE_TOKEN || "_AT_";
  const token =
    request.cookies.get(cookieName)?.value ||
    request.cookies.get("_AT_")?.value ||
    request.cookies.get("_T_")?.value;

  const isAuthPage = pathname === "/login" || pathname.startsWith("/login/");
  const isRootPage = pathname === "/";

  if (!token) {
    if (!isAuthPage) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isAuthPage || isRootPage) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export { proxy as middleware };

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
