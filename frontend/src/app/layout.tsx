import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { NotificationProvider } from "@/lib/notifications";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import { QueryProvider } from "@/lib/query-client";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rank.zobay.in"),
  title: "Zobay Rank — SEO, AEO & GEO Optimization Platform",
  description:
    "Next-generation SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) platform built for high-performance crawling and AI search visibility.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Zobay Rank — SEO, AEO & GEO Optimization Platform",
    description:
      "Zobay Rank helps businesses improve search visibility with SEO, Answer Engine Optimization and Generative Engine Optimization across traditional and AI-powered search.",
    url: "/",
    siteName: "Zobay Rank",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zobay Rank — SEO, AEO & GEO Optimization Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zobay Rank — SEO, AEO & GEO Optimization Platform",
    description:
      "Next-generation SEO, Answer Engine Optimization (AEO), and Generative Engine Optimization (GEO) platform built for high-performance crawling and AI search visibility.",
    images: ["/og-image.png"],
    site: "@zobayrank",
    creator: "@zobayrank",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} scroll-smooth`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('zobayrank_theme');
                if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground min-h-screen font-sans antialiased selection:bg-blue-600 selection:text-white overflow-x-clip w-full max-w-full">
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              <NotificationProvider>
                <ToastProvider>{children}</ToastProvider>
              </NotificationProvider>
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
