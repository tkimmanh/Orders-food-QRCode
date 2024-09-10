"use client";
import { useAppContext } from "@/components/app-provider";
import { getRefreshTokenFormLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

const LogoutPage = () => {
  const { mutateAsync } = useLogoutMutation();
  const searchParams = useSearchParams();
  const ref = useRef<any>(null);
  const router = useRouter();
  const { setIsAuth } = useAppContext();
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
      setIsAuth(false);
      router.push("/login");
    });
  }, [accessTokenFormUrl, mutateAsync, refreshTokenFormUrl, router, setIsAuth]);
  return null;
};

export default LogoutPage;
