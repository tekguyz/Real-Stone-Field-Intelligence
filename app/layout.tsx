import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { ReactQueryProvider } from "../shared/lib/providers/query-provider";
import { DemoBanner } from "../features/demo-switcher/DemoBanner";
import { IOSInstallBanner } from "../components/IOSInstallBanner";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { ServiceWorkerRegister } from "../shared/lib/hooks/useServiceWorker";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="en" suppressHydrationWarning className={cn("overscroll-none", "font-sans", geist.variable)}>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased text-foreground selection:bg-rsg-gold/30 overscroll-none`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ServiceWorkerRegister />
          <ReactQueryProvider>
            <div className="h-[100dvh] flex flex-col overflow-hidden overscroll-none">
              <DemoBanner />
              <div className="flex-1 overflow-hidden relative overscroll-none">
                {children}
              </div>
            </div>
            <IOSInstallBanner />
            <Toaster position="top-right" expand={true} richColors theme="system" />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
