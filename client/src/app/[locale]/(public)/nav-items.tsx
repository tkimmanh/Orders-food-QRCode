"use client";

import { useAppStore } from "@/components/app-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Role } from "@/constants/type";
import { cn, handleErrorApi } from "@/lib/utils";
import { Link } from "@/navigation";
import { useGuestLogoutMutation } from "@/queries/useGuest";
import { RoleType } from "@/types/jwt.types";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";

export default function NavItems({ className }: { className?: string }) {
  const t = useTranslations("Nav");
  const menuItems: {
    title: string;
    href: string;
    role?: RoleType[] | undefined;
    hideWhenLogin?: boolean | undefined;
  }[] = [
    {
      title: t("home"),
      href: "/",
    },
    {
      title: t("Dishes"),
      href: "/guest/menu",
      role: [Role.Guest],
    },
    {
      title: t("Orders"),
      href: "/guest/orders",
      role: [Role.Guest],
    },
    {
      title: t("login"),
      href: "/login",
      hideWhenLogin: true,
    },
    {
      title: t("Manage"),
      href: "/manage/dashboard",
      role: [Role.Owner, Role.Employee],
    },
  ];

  const { role, setRole, disconnectSocket } = useAppStore((state) => state);
  const logoutMutation = useGuestLogoutMutation();
  const router = useRouter();

  const logout = async () => {
    if (logoutMutation.isPending) return;
    try {
      await logoutMutation.mutateAsync();
      router.push("/");
      setRole(undefined);
      disconnectSocket();
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };
  return (
    <>
      {menuItems.map((item) => {
        // khi đã "đăng nhập" hiển thị menu item theo role
        const isAuth = item.role && item.role.includes(role!);
        // đã đăng nhập hiển thị menu item và ẩn item "Đăng nhập"
        const canShow =
          (item.role === undefined && !item.hideWhenLogin) ||
          (!role && item.hideWhenLogin);
        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          );
        } else {
          return null;
        }
      })}
      {role && (
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className={cn(className, "cursor-pointer")}>
                {t("logout")}
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc muốn đăng xuất?</AlertDialogTitle>
                <AlertDialogDescription>
                  Đăng xuất có thể sẽ khiến bạn không xem được trạng thái của
                  món ăn đã đặt
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("no")}</AlertDialogCancel>
                <AlertDialogAction onClick={logout}>
                  {t("yes")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  );
}
