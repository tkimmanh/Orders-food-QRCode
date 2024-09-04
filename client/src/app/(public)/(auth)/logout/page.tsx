"use client";
import { getRefreshTokenFormLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

const LogoutPage = () => {
  const { mutateAsync } = useLogoutMutation();
  const searchParams = useSearchParams();
  const ref = useRef<any>(null);
  const router = useRouter();
  const refreshTokenFormUrl = searchParams.get("refreshToken");

  useEffect(() => {
    if (
      ref.current ||
      refreshTokenFormUrl !== getRefreshTokenFormLocalStorage()
    ) {
      return;
    }
    ref.current = mutateAsync;
    mutateAsync().then(() => {
      setTimeout(() => {
        ref.current = null;
      }, 1000);
      router.push("/login");
    });
  }, [mutateAsync, refreshTokenFormUrl, router]);
  return <div>LogoutPage</div>;
};

export default LogoutPage;
