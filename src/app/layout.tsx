import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Toaster } from "sonner";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
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
  maximumScale: 5,
  userScalable: true,
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
    <html lang="cs" className={`${manrope.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-text selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>
          <AuthProvider>
            <ClientLayout>{children}</ClientLayout>
            <Toaster position="top-center" richColors closeButton theme="system" />
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
