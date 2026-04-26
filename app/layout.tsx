import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { ReactQueryProvider } from "../shared/lib/providers/query-provider";
import { DemoBanner } from "../features/demo-switcher/DemoBanner";
import { IOSInstallBanner } from "../components/IOSInstallBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Real Stone | Field Ops",
  description: "Industrial Field Intelligence & Project Tracking.",
  manifest: '/manifest.json',
  openGraph: {
    title: 'Real Stone | Field Ops',
    description: 'Industrial Field Intelligence & Project Tracking.',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Field Ops',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'oklch(0.98 0.005 75)' },
    { media: '(prefers-color-scheme: dark)', color: 'oklch(0.12 0.01 75)' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overscroll-none">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased text-foreground selection:bg-rsg-gold/30 overscroll-none`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReactQueryProvider>
            <DemoBanner />
            <div className="pt-10 print:pt-0 h-screen flex flex-col overscroll-none">
              {children}
            </div>
            <IOSInstallBanner />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
