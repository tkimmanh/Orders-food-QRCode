import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

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
}

export const authApiRequest = new AuthApiRequest();
