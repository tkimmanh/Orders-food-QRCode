import { guestApiRequest } from "@/apiRequest/guest";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(_request: Request) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) {
    return Response.json(
      {
        message: "Không tìm thấy refreshToken",
      },
      { status: 401 }
    );
  }
  try {
    const { payload } = await guestApiRequest.serverRefreshToken({
      refreshToken,
    });
    const decodedAccessToken = jwt.decode(payload.data.accessToken) as {
      exp: number;
    };
    const decodedRefreshToken = jwt.decode(payload.data.refreshToken) as {
      exp: number;
    };
    cookieStore.set("accessToken", payload.data.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax", // giảm rủi ro CSRF
      secure: true, // chỉ gửi cookie qua https
      expires: decodedAccessToken.exp * 1000, // thời gian hết hạn của token
    });
    cookieStore.set("refreshToken", payload.data.refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });
    return Response.json(payload);
  } catch (error: any) {
    return Response.json(
      {
        message: error.message ?? "Lỗi không xác định",
      },
      {
        status: 401,
      }
    );
  }
}
