import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chart Insight Assistant",
  description: "Portfolio-ready foundation for a stock chart analysis assistant.",
};

type RootLayoutProps = {
  children: ReactNode;
};

const ADSENSE_SCRIPT_URL =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9057658678883484";

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          id="google-adsense"
          async
          strategy="afterInteractive"
          src={ADSENSE_SCRIPT_URL}
          crossOrigin="anonymous"
        />
        <div className="relative min-h-screen overflow-hidden">
          <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-sky-400/10 to-transparent" />
          <div className="page-shell">
            <SiteHeader />
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
