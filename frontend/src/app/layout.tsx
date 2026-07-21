import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oxford 3000",
  description: "Hệ thống học và ôn tập 3000 từ vựng Oxford",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
