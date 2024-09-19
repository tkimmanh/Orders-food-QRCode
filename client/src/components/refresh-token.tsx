"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { checkRefreshToken } from "@/lib/utils";
import socket from "@/lib/socket";

// page không check refresh token;
const UNAUTHENTICATED_PATH = ["/login", "/logout", "refresh-token"];
const RefreshToken = () => {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    const onRefreshToken = (force?: boolean) => {
      checkRefreshToken({
        onError: () => {
          clearInterval(interval);
          router.push("/login");
        },
        force,
      });
    };
    // check refresh token khi mới vào trang
    onRefreshToken();
    const TIMEOUT = 1000;
    // Timeout interval phải bé hơn thời gian hết hạn của accessToken
    // VD: thời gian hết hạn accessToken là 10s thì 1s mình sẽ cho check 1 lần
    interval = setInterval(onRefreshToken, TIMEOUT);

    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket.id);
    }

    function onDisconnect() {
      console.log("disconnect");
    }

    function onRefreshTokenSocket() {
      onRefreshToken(true);
    }
    // check refresh token khi socket bị disconnect
    onRefreshToken();
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("refresh-token", onRefreshTokenSocket);
    return () => {
      clearInterval(interval);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("refresh-token", onRefreshTokenSocket);
    };
  }, [pathname, router]);
  return null;
};

export default RefreshToken;
