import { defaultLocale } from "@/config";
import Layout from "../(public)/layout";

export default function GusetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout
      params={{
        locale: defaultLocale,
      }}
      modal={null}
    >
      {children}
    </Layout>
  );
}
