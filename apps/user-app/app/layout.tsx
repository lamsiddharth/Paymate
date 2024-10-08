import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Paymate",
  description: "Generated by create next app",
};
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/providers";

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
