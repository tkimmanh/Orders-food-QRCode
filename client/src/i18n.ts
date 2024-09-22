import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // ngôn ngữ mặc đinh có thể đọc từ `cookies()`, `headers()`, v.v.
  const locale = "vi";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
