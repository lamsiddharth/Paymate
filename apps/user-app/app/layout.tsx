import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Paymate",
  description: "Generated by create next app",
};
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/providers";
import { GridBackgroundDemo } from "@/components/ui/grid-background";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className="bg-black">
          {children}
          <Toaster />
          
        </body>
      </Providers>
    </html>
  );
}
