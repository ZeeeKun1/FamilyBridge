import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "安语",
  description: "让爱，无需言说",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-mibai min-h-screen flex justify-center">
        <div className="w-full max-w-mobile min-h-screen bg-mibai shadow-lg relative flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
