import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import dynamic from 'next/dynamic';
import { Suspense } from "react";
import { Toaster } from "sonner";

const AuthToast = dynamic(() => import('@/components/AuthToast').then((mod) => mod.AuthToast));


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeetBot",
  description: "Bot which will give you summary of a video call",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
        {children}
        <Toaster richColors/>
        <Suspense fallback={'/'}>
          <AuthToast />
        </Suspense>
        </Providers>
      </body>
    </html>
  );
}
