"use client";

import { getAccessTokenFormLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  {
    title: "Món ăn",
    href: "/menu",
  },
  {
    title: "Đơn hàng",
    href: "/orders",
  },
  {
    title: "Đăng nhập",
    href: "/login",
    authRequired: false, //hiển thị khi chưa đăng nhập
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    authRequired: true, // hiển thị khi đã đăng nhập
  },
];

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFormLocalStorage()));
  }, []);
  return menuItems.map((item) => {
    if ((!item.authRequired && isAuth) || (item.authRequired && !isAuth))
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
