import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import {
  GuestCreateOrdersBodyType,
  GuestCreateOrdersResType,
  GuestGetOrdersResType,
  GuestLoginBodyType,
  GuestLoginResType,
} from "@/schemaValidations/guest.schema";

class GuestApiRequest {
  public refreshTokenRequest: Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null;
  constructor() {
    this.refreshTokenRequest = null;
  }
  async severLogin(body: GuestLoginBodyType) {
    return await http.post<GuestLoginResType>("/guest/auth/login", body);
  }
  async nextServerLogin(body: GuestLoginBodyType) {
    return await http.post<GuestLoginResType>("/api/guest/auth/login", body, {
      baseUrl: "",
    });
  }

  async serverLogout(
    body: LogoutBodyType & {
      accessToken: string;
    }
  ) {
    return await http.post<LoginResType>(
      "guest/auth/logout",
      { refreshToken: body.refreshToken },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    );
  }

  async nextServerLogout() {
    return await http.post<GuestLoginResType>("/api/guest/auth/logout", null, {
      baseUrl: "",
    });
  }

  async serverRefreshToken(body: RefreshTokenBodyType) {
    return await http.post<RefreshTokenResType>("/guest/auth/refresh-token", {
      refreshToken: body.refreshToken,
    });
  }

  async nextServerRefreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "/api/guest/auth/refresh-token",
      null,
      {
        baseUrl: "",
      }
    );
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  }

  order(body: GuestCreateOrdersBodyType) {
    return http.post<GuestCreateOrdersResType>("/guest/orders", body);
  }
  getOrdersList() {
    return http.get<GuestGetOrdersResType>("guest/orders");
  }
}

export const guestApiRequest = new GuestApiRequest();
