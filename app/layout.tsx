import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from '@/components/ui/sonner';
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import NextTopLoader from 'nextjs-toploader';
import { ThemeProvider } from "@/components/theme-provider"
import Breadcrumbs from "@/components/breadcrumbs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/drizzle/db";

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
    template: "%s | DAWSS Grad Social Booking",
    default: "DAWSS Grad Social Booking"
  },
  description: "Manage your 2025 Donald A. Wilson Grad Social booking.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  const user = await db.query.user.findFirst({
    where: (s, { eq }) => (eq(s.id, session?.user.id || "")),
  })

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextTopLoader showSpinner={false} color="#8f8f8f" />
          <main className="md:flex h-svh items-center justify-center">
            <Card className="overflow-hidden p-0 md:max-h-[550px] w-full md:max-w-[800px] lg:max-w-[950px]">
              <CardContent className="p-0">
                <SidebarProvider className="items-start">
                  <Sidebar admin={(session && user && user.role) || false} />
                  <main className="flex flex-1 flex-col overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
                      <div className="flex items-center gap-2 px-4">
                        <Breadcrumbs />
                      </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0 m-4">
                      {children}
                    </div>
                  </main>
                </SidebarProvider>
              </CardContent>
            </Card>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
