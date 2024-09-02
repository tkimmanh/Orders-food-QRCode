import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
} from "@/schemaValidations/auth.schema";

class AuthApiRequest {
  // gọi tới server login
  async severLogin(body: LoginBodyType) {
    return await http.post<LoginResType>("/auth/login", body);
  }
  // gọi tới nextjs server
  async clientLogin(body: LoginBodyType) {
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

  async clientLogout() {
    return await http.post<LoginResType>("/api/auth/logout", null, {
      baseUrl: "",
    });
  }
}

export const authApiRequest = new AuthApiRequest();
