import { authApiRequest } from "@/apiRequest/auth";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "Không nhận được token",
      },
      {
        status: 200,
      }
    );
  }
  try {
    const result = await authApiRequest.serverLogout({
      accessToken,
      refreshToken,
    });

    return Response.json(result.payload);
  } catch (error) {
    console.log(error);
    Response.json(
      {
        message: "Đã có lỗi xảy ra",
      },
      {
        status: 200,
      }
    );
  }
}
