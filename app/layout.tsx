import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | DAWSS Prom Booking",
    default: "DAWSS Prom Booking"
  },
  description: "Manage your 2025 Donald A. Wilson prom booking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] antialiased`}
      >
        <main className="py-16 sm:py-20 mx-auto lg:px-8 lg:max-w-7xl px-4 sm:px-6 max-w-2xl">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
