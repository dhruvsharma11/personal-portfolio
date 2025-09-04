import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { TypewriterProvider } from "@/components/common/TypewriterProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap', // Optimize font loading
  preload: true,
});

export const metadata: Metadata = {
  title: "Dhruv Sharma - Portfolio",
  description: "Software Engineer and AI Enthusiast",
  keywords: ["Dhruv Sharma", "Software Engineer", "AI Engineer", "Portfolio", "React", "Next.js"],
  authors: [{ name: "Dhruv Sharma" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://github.com" />
        <link rel="preconnect" href="https://linkedin.com" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://linkedin.com" />
        <link rel="dns-prefetch" href="https://goaugment.com" />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        <TypewriterProvider>
          {children}
        </TypewriterProvider>
      </body>
    </html>
  );
}
