import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "./services/locale";

export default getRequestConfig(async () => {
  // ngôn ngữ mặc đinh có thể đọc từ `cookies()`, `headers()`, v.v.
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
