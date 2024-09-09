import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";

class AuthApiRequest {
  public refreshTokenRequest: Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null;

  constructor() {
    this.refreshTokenRequest = null;
  }
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

  async nextServerRefreshToken() {
    //đảm bảo rằng không bị duplicate request refresh token
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "/api/auth/refresh-token",
      null,
      {
        baseUrl: "",
      }
    );
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  }
}

export const authApiRequest = new AuthApiRequest();
