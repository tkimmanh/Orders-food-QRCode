"use client";
import { handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "./app-provider";

const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];

export default function ListenLogoutSocket() {
  const pathname = usePathname();
  const router = useRouter();
  const { isPending, mutateAsync } = useLogoutMutation();
  const { setRole, socket, disconnectSocket } = useAppStore((state) => state);
  useEffect(() => {
    // nếu đang ở trang không cần xác thực thì không cần lắng nghe sự kiện logout
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    async function onLogout() {
      if (isPending) return;
      try {
        await mutateAsync();
        setRole();
        disconnectSocket();
        router.push("/");
      } catch (error: any) {
        handleErrorApi({
          error,
        });
      }
    }
    // lắng nghe sự kiện logout từ server khi xóa tài khoản khỏi db
    socket?.on("logout", onLogout);
    return () => {
      socket?.off("logout", onLogout);
    };
  }, [
    socket,
    pathname,
    setRole,
    router,
    isPending,
    mutateAsync,
    disconnectSocket,
  ]);
  return null;
}
