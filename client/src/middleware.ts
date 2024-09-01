import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = Boolean(request.cookies.get("accessToken")?.value);

  // chưa đăng nhập không vào được các privatePaths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // đã đăng nhập không vào được các unAuthPaths
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // tiếp tục xử lý request
  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login"],
};
