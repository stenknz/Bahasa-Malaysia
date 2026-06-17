import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ServiceWorkerRegistration } from "@/components/ui/service-worker-registration";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bahasa Malaysia Mastery",
  description: "Learn to speak, understand, read, and write Bahasa Malaysia",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "BM Mastery" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <SessionProvider>
          {children}
          <ServiceWorkerRegistration />
        </SessionProvider>
      </body>
    </html>
  );
}
