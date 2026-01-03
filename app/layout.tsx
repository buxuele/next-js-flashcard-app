import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "智慧回响",
  description: "智慧名言与古诗词学习应用",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-slate-900">{children}</body>
    </html>
  );
}
