"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Locale, locales } from "@/config";
import { setUserLocale } from "@/services/locale";
import { useLocale, useTranslations } from "next-intl";

import React, { use } from "react";

const SwitchLanguage = () => {
  const t = useTranslations("SwitchLanguage");
  const local = useLocale();
  return (
    <>
      <Select
        value={local}
        onValueChange={(value) => setUserLocale(value as Locale)}
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
