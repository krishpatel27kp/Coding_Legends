import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Background3D } from "@/components/background-3d";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DataPulse – API-First Form Tracking",
  description: "Universal form backend with real-time analytics and premium design.",
  openGraph: {
    title: "DataPulse – API-First Form Tracking",
    description: "Universal form backend with real-time analytics and premium design.",
    url: "https://datapulse.io",
    siteName: "DataPulse",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DataPulse – API-First Form Tracking",
    description: "Universal form backend with real-time analytics and premium design.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <Background3D />
          {children}
        </Providers>
      </body>
    </html>
  );
}
