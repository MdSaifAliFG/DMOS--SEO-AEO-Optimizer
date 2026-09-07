import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { NotificationProvider } from "@/lib/notifications";
import { ThemeProvider } from "@/lib/theme";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SeoSensing — SEO & AEO Optimization Platform",
  description:
    "Next-generation SEO and Answer Engine Optimization (AEO) platform built for high-performance crawling and AI search visibility.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
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
                const stored = localStorage.getItem('seosensing_theme');
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
      <body className="bg-background text-foreground min-h-screen font-sans antialiased selection:bg-blue-600 selection:text-white">
        <ThemeProvider>
          <NotificationProvider>
            <ToastProvider>{children}</ToastProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
