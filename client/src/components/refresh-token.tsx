"use client";

import {
  getAccessTokenFormLocalStorage,
  getRefreshTokenFormLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import { authApiRequest } from "@/apiRequest/auth";

// page không check refresh token;
const UNAUTHENTICATED_PATH = ["/login", "/logout", "refresh-token"];
const RefreshToken = () => {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    const checkRefreshToken = async () => {
      const accessToken = getAccessTokenFormLocalStorage();
      const refreshToken = getRefreshTokenFormLocalStorage();
      // chưa đăng nhập thì không hoạt động
      if (!accessToken || !refreshToken) return;
      const decodedAccessToken = jwt.decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const decodedRefreshToken = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };

      const now = Math.round(new Date().getTime() / 1000);
      // refresh token hết hạn không xử lý
      if (decodedRefreshToken.exp <= now) return;
      // nếu thời gian của accessToken còn 1/3 thì sẽ cho check refresh token
      if (
        decodedAccessToken.exp - now > 0 &&
        decodedAccessToken.exp - now <
          (decodedAccessToken.exp - decodedAccessToken.iat) / 3
      ) {
        try {
          const res = await authApiRequest.nextServerRefreshToken();
          setAccessTokenToLocalStorage(res.payload.data.accessToken);
          setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
        } catch (error) {
          clearInterval(interval);
        }
      }
    };
    // chạy lần đầu
    checkRefreshToken();
    // timeout phải bé hơn thời gian của accessToken
    // nếu 10s accessToken hết hạn thì 1s , -> sẽ check 1 lần
    const TIMEOUT = 1000;
    interval = setInterval(checkRefreshToken, TIMEOUT);
    return () => clearInterval(interval);
  }, [pathname]);
  return null;
};

export default RefreshToken;
