import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Role } from "./constants/type";
import { decodeToken } from "./lib/utils";

const mangePaths = ["/manage"];
const guestPaths = ["/guest"];
const privatePaths = [...mangePaths, ...guestPaths];
const onlyOwnerPaths = ["/manage/accounts"];
const unAuthPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  //1. Chưa đăng nhập và truy cập vào các privte route , manage ...
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearToken", "true");
    return NextResponse.redirect(url);
  }

  //2. Đã đăng nhập
  if (refreshToken) {
    
    // 2.1 Đã đăng nhập không vào được các trang trong "unAuthPaths"
    if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 2.2 Đã đăng nhập nhưng "accessToken" hết hạn
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    //2.3 Truy cập vào các route không đúng role
    const role = decodeToken(refreshToken).role;

    // Guest nhưng truy cập vào các trang manage owner
    const isGuestGoToManage =
      role === Role.Guest &&
      mangePaths.some((path) => pathname.startsWith(path));

    // Không phải Guest nhưng truy cập vào các route của Guest
    const isNotGuestGoToGuest =
      role !== Role.Guest &&
      guestPaths.some((path) => pathname.startsWith(path));
    if (isGuestGoToManage || isNotGuestGoToGuest) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // không phải owner nhưng truy cập vào các route chỉ dành cho owner
    const isNotOwnerGoToOwnerPath =
      role !== Role.Owner &&
      onlyOwnerPaths.some((path) => pathname.startsWith(path));

    if (isNotOwnerGoToOwnerPath || isNotGuestGoToGuest || isGuestGoToManage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // tiếp tục xử lý request
    return NextResponse.next();
  }
}
// middleware sẽ được áp dụng tại các route
export const config = {
  matcher: ["/manage/:path*", "/guest/:path*", "/login"],
};
