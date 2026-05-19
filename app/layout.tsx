import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://virtual-lotus.com"),
  title: "VirtualLotus — AI Companions",
  description: "Meet extraordinary AI companions with real personalities, humor, and boundaries. Available 24/7 in multiple languages.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
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
    url: "https://virtual-lotus.com",
    siteName: "VirtualLotus",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VirtualLotus — AI Companions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VirtualLotus — AI Companions",
    description: "Real conversations. No compromise.",
    images: ["/og-image.png"],
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