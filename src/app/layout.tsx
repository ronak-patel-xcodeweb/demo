import { ReactNode } from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/config/app-config";
import { Montserrat, Poppins } from "next/font/google";
import { Raleway } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
//fonts
const poppins = Poppins({
  weight: ['400', '600', '700'], // choose the weights you need
  subsets: ['latin'],
  variable: '--font-poppins', // create a CSS variable
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '700'],  // 700 = Bold
  variable: '--font-raleway',
  display: 'swap',
})


const montserrat = Montserrat({
  weight: ['400', '600', '700'], // choose the weights you need
  subsets: ['latin'],
  variable: '--font-montserrot', // create a CSS variable
  display: 'swap',
})


export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      
      <body className={`${inter.className} min-h-screen antialiased poppins raleway montserrat dark`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
