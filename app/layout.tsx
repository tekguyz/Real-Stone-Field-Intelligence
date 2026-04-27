import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { ReactQueryProvider } from "../shared/lib/providers/query-provider";
import { DemoBanner } from "../features/demo-switcher/DemoBanner";
import { IOSInstallBanner } from "../components/IOSInstallBanner";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rs-field-ops.netlify.app/"),
  title: "Real Stone | Field Ops",
  description: "Industrial Field Intelligence & Project Tracking.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-light.svg", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.svg", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [{ url: "/favicon-dark.svg" }],
  },
  openGraph: {
    title: "Real Stone | Field Ops",
    description: "Industrial Field Intelligence & Project Tracking.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Field Ops System",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Field Ops",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  userScalable: true,
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
            <Toaster position="top-right" expand={true} richColors theme="system" />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
