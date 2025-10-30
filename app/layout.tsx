import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Suspense } from "react";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Kwilion Solutions - Adapting Your Business for What's Next",
  description:
    "Strategic technology consulting, web & app development, workflow automation, and maintenance services. Adapting your business for what's next.",
  generator: "v0.app",
  icons: {
    icon: "/kwilion-favicon.ico",
    shortcut: "/kwilion-favicon.ico",
    apple: "/kwilion-favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Navigation is a Client Component, layout is a Server Component: this is OK */}
        <Navigation />
        {/* Keep Suspense around children if you want, but it’s optional */}
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Footer />
      </body>
    </html>
  );
}
