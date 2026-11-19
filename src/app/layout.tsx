import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "אהבות קטנות",
};

export const viewport: Viewport = {
  themeColor: "#1f3a93",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${fontVariables} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
