import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";

class AuthApiRequest {
  // gọi tới server login
  async severLogin(body: LoginBodyType) {
    return await http.post<LoginResType>("/auth/login", body);
  }
  // gọi tới nextjs server
  async nextServerLogin(body: LoginBodyType) {
    return await http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    });
  }

  async serverLogout(
    body: LogoutBodyType & {
      accessToken: string;
    }
  ) {
    return await http.post<LoginResType>(
      "/auth/logout",
      { refreshToken: body.refreshToken },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    );
  }

  async nextServerLogout() {
    return await http.post<LoginResType>("/api/auth/logout", null, {
      baseUrl: "",
    });
  }

  async serverRefreshToken(body: RefreshTokenBodyType) {
    return await http.post<RefreshTokenResType>("/auth/refresh-token", {
      refreshToken: body.refreshToken,
    });
  }

  async nextServerRefreshToken(body: RefreshTokenBodyType) {
    return await http.post<RefreshTokenResType>(
      "/api/auth/refresh-token",
      body,
      {
        baseUrl: "",
      }
    );
  }
}

export const authApiRequest = new AuthApiRequest();
