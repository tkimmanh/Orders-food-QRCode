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
import React, { Suspense } from "react";
import { usePathname, useRouter } from "@/navigation";

const SwitchLanguage = () => {
  const t = useTranslations("SwitchLanguage");
  const local = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <Select
        value={local}
        onValueChange={(value) => {
          router.replace(pathname, {
            locale: value as Locale,
          });
          router.refresh();
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
