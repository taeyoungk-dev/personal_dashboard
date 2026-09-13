import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Focus — Personal OS",
  description: "글로벌 소프트웨어 엔지니어 목표를 오늘의 실행으로 연결하는 개인 대시보드",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
