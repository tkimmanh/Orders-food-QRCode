"use client";
import { useAppStore } from "@/components/app-provider";
import { toast } from "@/hooks/use-toast";
import { decodeToken, generateSocketInstance } from "@/lib/utils";
import { useRouter } from "@/navigation";
import { useSetTokenToCookieMutation } from "@/queries/useAuth";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function OAuth() {
  const { setSocket, setRole } = useAppStore();
  const { mutateAsync } = useSetTokenToCookieMutation();
  const searchParams = useSearchParams();
  const ref = useRef(0);
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const router = useRouter();
  const message = searchParams.get("message");
  console.log({
    accessToken,
    refreshToken,
    message,
  });

  useEffect(() => {
    if (accessToken && refreshToken) {
      if (ref.current === 0) {
        const decodedToken = decodeToken(accessToken);
        if (decodedToken) {
          setRole(decodedToken.role);
        }
        setSocket(generateSocketInstance(accessToken));
        mutateAsync({ accessToken, refreshToken })
          .then(() => {
            router.push("/manage/dashboard");
          })
          .catch((err) => {
            setTimeout(() => {
              toast({
                description: err.message || "Có lỗi xảy ra",
              });
            });
          });
        ref.current++;
      }
    } else {
      if (ref.current === 0) {
        setTimeout(() => {
          toast({
            description: message ? message : "Có lỗi xảy ra",
          });
          router.push("/login");
        });
        ref.current++;
      }
    }
  }, [accessToken, refreshToken, setSocket, setRole]);

  return null;
}

const OAuthPage = () => {
  return (
    <Suspense>
      <OAuth />
    </Suspense>
  );
};

export default OAuthPage;
