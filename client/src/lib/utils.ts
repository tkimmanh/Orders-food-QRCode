import { type ClassValue, clsx } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "@/hooks/use-toast";
import { authApiRequest } from "@/apiRequest/auth";
import jwt from "jsonwebtoken";
import { DishStatus, OrderStatus, Role, TableStatus } from "@/constants/type";
import { envConfig } from "@/config";
import { TokenPayload } from "@/types/jwt.types";
import { guestApiRequest } from "@/apiRequest/guest";
import { format } from "date-fns";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";
import { io } from "socket.io-client";

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
    console.log("error", error);

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
  force?: boolean;
}) => {
  const accessToken = getAccessTokenFormLocalStorage();
  const refreshToken = getRefreshTokenFormLocalStorage();

  // chưa đăng nhập thì không hoạt động
  if (!accessToken || !refreshToken) return;
  const decodedAccessToken = decodeToken(accessToken);
  const decodedRefreshToken = decodeToken(refreshToken);
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
    param?.force ||
    decodedAccessToken.exp - now <
      (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    try {
      const role = decodedRefreshToken.role;
      const res =
        role === Role.Guest
          ? await guestApiRequest.nextServerRefreshToken()
          : await authApiRequest.nextServerRefreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      param?.onSuccess && param.onSuccess();
    } catch (error) {
      param?.onError && param.onError();
    }
  }
};

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn";
    case DishStatus.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
  }
};

export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "Đã phục vụ";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Processing:
      return "Đang nấu";
    default:
      return "Từ chối";
  }
};

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn";
    case TableStatus.Reserved:
      return "Đã đặt";
    default:
      return "Ẩn";
  }
};

export const getTableLink = ({
  token,
  tableNumber,
  locale = "vi",
}: {
  token: string;
  tableNumber: number;
  locale?: string;
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL +
    `/${locale}/` +
    `tables/` +
    tableNumber +
    "?token=" +
    token
  );
};

export function decodeToken(token: string) {
  return jwt.decode(token) as TokenPayload;
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(
    date instanceof Date ? date : new Date(date),
    "HH:mm:ss dd/MM/yyyy"
  );
};

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), "HH:mm:ss");
};

export function removeAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  // vd : fullText = "Nguyễn Văn A" , matchText = "nguyen van a" hoặc "nguyen a"
  return removeAccents(fullText.toLowerCase()).includes(
    removeAccents(matchText.trim().toLowerCase())
  );
};

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins,
};

export const generateSocketInstance = (accessToken: string) => {
  return io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
    auth: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const wrapServerApi = async <T>(fn: () => Promise<T>) => {
  let result = null;
  try {
    result = await fn();
  } catch (error: any) {
    if (error?.digest?.includes("NEXT_REDIRECT")) {
      // nếu là các lỗi liên quan đến redirect thì throw ra để có thể redirect
      throw error;
    }
  }
  return result;
};
