"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Locale, locales } from "@/config";
import { useLocale, useTranslations } from "next-intl";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import React from "react";

const SwitchLanguage = () => {
  const t = useTranslations("SwitchLanguage");
  const local = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  return (
    <>
      <Select
        value={local}
        onValueChange={(value) => {
          const locale = params.locale as Locale; // lấy giá trị locale từ params 'en' hoặc 'vi'
          const newPatchName = pathname.replace(`/${locale}`, `/${value}`); // thay thế giá trị locale cũ bằng giá trị locale mới
          const fullUrl = `${newPatchName}?${searchParams.toString()}`; // tạo url mới /en/abc?name=abc
          router.replace(fullUrl); // thay đổi url
          router.refresh(); // refresh lại trang 
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("title")} />
        </SelectTrigger>
        <SelectContent>
          {locales.map((locale, index) => {
            return (
              <SelectItem key={index + 1} value={locale}>
                {t(locale)}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </>
  );
};

export default SwitchLanguage;
