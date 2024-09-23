"use client";

import {
  checkRefreshToken,
  getRefreshTokenFormLocalStorage,
} from "@/lib/utils";
import { useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function RefreshToken() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const redirectPathname = searchParams.get("redirect");
  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFormLocalStorage()
    ) {
      checkRefreshToken({
        onSuccess: () => {
          router.push(redirectPathname || "/");
        },
      });
    } else {
      router.push("/");
    }
  }, [router, refreshTokenFromUrl, redirectPathname]);
  return null;
}

export default function RefreshTokenPage() {
  return (
    <Suspense>
      <RefreshToken></RefreshToken>
    </Suspense>
  );
}
