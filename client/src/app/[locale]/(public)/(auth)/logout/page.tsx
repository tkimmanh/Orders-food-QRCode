"use client";
import { useAppStore } from "@/components/app-provider";
import { getRefreshTokenFormLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter } from "@/navigation";
import React, { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

function Logout() {
  const { mutateAsync } = useLogoutMutation();
  const searchParams = useSearchParams();
  const ref = useRef<any>(null);
  const router = useRouter();
  const { setRole, setSocket, socket } = useAppStore((state) => state);
  const refreshTokenFormUrl = searchParams.get("refreshToken");
  const accessTokenFormUrl = searchParams.get("accessToken");

  useEffect(() => {
    if (
      (!ref.current &&
        refreshTokenFormUrl &&
        refreshTokenFormUrl === getRefreshTokenFormLocalStorage()) ||
      (accessTokenFormUrl &&
        accessTokenFormUrl === getRefreshTokenFormLocalStorage())
    ) {
      return;
    } else {
      router.push("/");
    }
    ref.current = mutateAsync;
    mutateAsync().then(() => {
      setTimeout(() => {
        ref.current = null;
      }, 1000);
      setRole(undefined);
      socket?.disconnect();
      setSocket(undefined);
      router.push("/login");
    });
  }, [
    accessTokenFormUrl,
    mutateAsync,
    refreshTokenFormUrl,
    router,
    setRole,
    setSocket,
    socket,
  ]);
  return null;
}

const LogoutPage = () => {
  return (
    <Suspense>
      <Logout></Logout>
    </Suspense>
  );
};

export default LogoutPage;
