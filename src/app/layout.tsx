import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthGuard from "@/components/layout/AuthGuard";
import BottomNav from "@/components/layout/BottomNav";
import PhoneFrame from "@/components/layout/PhoneFrame";

export const metadata: Metadata = {
  title: "安语",
  description: "让爱，无需言说",
  manifest: "/manifest.json",
  other: {
    "theme-color": "#A3B8C6",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-mibai min-h-screen flex justify-center">
        <PhoneFrame>
          <div className="w-full max-w-mobile h-full bg-mibai shadow-lg relative flex flex-col overflow-hidden">
            <AuthGuard>
              <main className="flex-1 overflow-y-auto">{children}</main>
            </AuthGuard>
            <BottomNav />
          </div>
        </PhoneFrame>
      </body>
    </html>
  );
}
