"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { checkRefreshToken } from "@/lib/utils";

// page không check refresh token;
const UNAUTHENTICATED_PATH = ["/login", "/logout", "refresh-token"];
const RefreshToken = () => {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    checkRefreshToken({
      onError: () => {
        clearInterval(interval);
        router.push("/login");
      },
    });
    const TIMEOUT = 1000;
    interval = setInterval(() => {
      checkRefreshToken({
        onError: () => {
          clearInterval(interval);
          router.push("/login");
        },
      });
    }, TIMEOUT);
    return () => clearInterval(interval);
  }, [pathname, router]);
  return null;
};

export default RefreshToken;
