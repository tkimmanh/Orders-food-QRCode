import type { NextRequest } from "next/server";
import { Role } from "./constants/type";
import { TokenPayload } from "./types/jwt.types";
import jwt from "jsonwebtoken";
import { defaultLocale } from "./config";
import createMiddleware from "next-intl/middleware";

function decodeToken(token: string) {
  return jwt.decode(token) as TokenPayload;
}

const mangePaths = ["/vi/manage", "/en/manage"];
const guestPaths = ["/vi/guest", "/en/guest"];
const privatePaths = [...mangePaths, ...guestPaths];
const onlyOwnerPaths = ["/vi/manage/accounts", "/en/manage/accounts"];
const unAuthPaths = ["/vi/login", "en/login", "en/register"];

export function middleware(request: NextRequest) {
  // Xử lý i18n-intl routing
  const handleI18nRouting = createMiddleware({
    locales: ["en", "vi"],
    defaultLocale,
  });
  const response = handleI18nRouting(request);

  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  //1. Chưa đăng nhập và truy cập vào các privte route , manage ...
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearToken", "true");

    response.headers.set("x-middleware-rewrite", url.toString());
    return response;
  }

  //2. Đã đăng nhập
  if (refreshToken) {
    // 2.1 Đã đăng nhập không vào được các trang trong "unAuthPaths"
    if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
      // return NextResponse.redirect(new URL("/", request.url));
      response.headers.set(
        "x-middleware-rewrite",
        new URL("/", request.url).toString()
      );
      return response;
    }

    // 2.2 Đã đăng nhập nhưng "accessToken" hết hạn
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      // return NextResponse.redirect(url);
      response.headers.set("x-middleware-rewrite", url.toString());
      return response;
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
      // return NextResponse.redirect(new URL("/", request.url));
      response.headers.set(
        "x-middleware-rewrite",
        new URL("/", request.url).toString()
      );
      return response;
    }

    // không phải owner nhưng truy cập vào các route chỉ dành cho owner
    const isNotOwnerGoToOwnerPath =
      role !== Role.Owner &&
      onlyOwnerPaths.some((path) => pathname.startsWith(path));

    if (isNotOwnerGoToOwnerPath || isNotGuestGoToGuest || isGuestGoToManage) {
      // return NextResponse.redirect(new URL("/", request.url));
      response.headers.set(
        "x-middleware-rewrite",
        new URL("/", request.url).toString()
      );
      return response;
    }
  }
  // tiếp tục xử lý request
  return response;
}
// middleware sẽ được áp dụng tại các route
export const config = {
  // matcher: ["/manage/:path*", "/guest/:path*", "/login"],
  matcher: ["/", "/(vi|en)/:path*"],
};
