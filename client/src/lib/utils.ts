import { type ClassValue, clsx } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "@/hooks/use-toast";
import { authApiRequest } from "@/apiRequest/auth";
import jwt from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
  // nếu path bắt đầu bằng / thì cắt bỏ đi
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

const isBrowser = typeof window !== "undefined";

export const getAccessTokenFormLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};
export const getRefreshTokenFormLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};
export const setAccessTokenToLocalStorage = (accessToken: string) => {
  return isBrowser && localStorage.setItem("accessToken", accessToken);
};
export const setRefreshTokenToLocalStorage = (refreshToken: string) => {
  return isBrowser && localStorage.setItem("refreshToken", refreshToken);
};

export const removeTokenFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("accessToken");
  isBrowser && localStorage.removeItem("refreshToken");
};

export const checkRefreshToken = async (param: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
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
  /*
  Do khi lưu RefreshToken vào cookie bằng expires thì sẽ bị sai 1 vài ms ,
  khiến middleware sẽ hoạt động không đúng với yêu cầu 
  lên phải - đi 1s để đảm bảo chính xác
  - bên middleware kiểm tra có refreshToken là đã đăng nhập -> redirect : /
  - tại đây kiểm tra refreshToken hết hạn thì đăng xuất -> redirect : /login
  -> Do sai về thời gian và điều kiện được chạy trước refreshToken -> redirect vào : / -> nên sẽ bị redirect không đúng
  - 
  */
  const now = new Date().getTime() / 1000 - 1;
  // refresh token hết hạn thì đăng xuất
  if (decodedRefreshToken.exp <= now) {
    removeTokenFromLocalStorage();
    param?.onError && param.onError();
    return;
  }
  // nếu thời gian của accessToken còn 1/3 thì sẽ cho check refresh token
  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    try {
      const res = await authApiRequest.nextServerRefreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      param?.onSuccess && param.onSuccess();
    } catch (error) {
      param?.onError && param.onError();
    }
  }
};
