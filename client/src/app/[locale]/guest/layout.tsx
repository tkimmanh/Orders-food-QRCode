import Layout from "../(public)/layout";

export default function GusetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout modal={null}>{children}</Layout>;
}