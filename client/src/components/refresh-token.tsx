"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { checkRefreshToken } from "@/lib/utils";

// page không check refresh token;
const UNAUTHENTICATED_PATH = ["/login", "/logout", "refresh-token"];
const RefreshToken = () => {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    checkRefreshToken({
      onError: () => {
        clearInterval(interval);
      },
    });
    const TIMEOUT = 1000;
    interval = setInterval(checkRefreshToken, TIMEOUT);
    return () => clearInterval(interval);
  }, [pathname]);
  return null;
};

export default RefreshToken;
