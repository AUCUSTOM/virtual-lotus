import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VirtualLotus — AI Companions",
  description: "Meet extraordinary AI companions with real personalities, humor, and boundaries. Available 24/7 in 50+ languages.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VirtualLotus",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    title: "VirtualLotus — AI Companions",
    description: "Real conversations. No compromise.",
  },
};

export const viewport: Viewport = {
  themeColor: "#8b6b5a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VirtualLotus" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
