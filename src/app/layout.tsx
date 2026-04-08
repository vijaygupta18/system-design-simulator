import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";



const geistSans = Geist({

  variable: "--font-geist-sans",

  subsets: ["latin"],

});



const geistMono = Geist_Mono({

  variable: "--font-geist-mono",

  subsets: ["latin"],

});



export const metadata: Metadata = {

  title: "SystemSim — System Design Simulator",

  description: "Interactive system design interview simulator with real-time load testing and scoring",

};



export default function RootLayout({

  children,

}: Readonly<{

  children: React.ReactNode;

}>) {

  return (

    <html

      lang="en"

      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}

    >

      <body className="h-full overflow-hidden bg-background text-foreground">

        <TooltipProvider>

          {children}

        </TooltipProvider>

      </body>

    </html>

  );

}

