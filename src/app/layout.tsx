import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ClientLayout } from "@/components/layout/ClientLayout";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Echo - Sdílej náladu, najdi pochopení",
  description: "Bezpečný prostor pro sdílení tvých pocitů a nálad. Připoj se ke komunitě, která naslouchá.",
  applicationName: "Echo",
  authors: [{ name: "Echo Team" }],
  keywords: ["mood", "journal", "mental health", "community", "sharing", "czech"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Echo",
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: "https://echo-app.vercel.app",
    title: "Echo - Sdílej náladu",
    description: "Bezpečný prostor pro sdílení tvých pocitů a nálad.",
    siteName: "Echo",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFCF8" },
    { media: "(prefers-color-scheme: dark)", color: "#1C1917" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="font-sans antialiased bg-background text-text">
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
