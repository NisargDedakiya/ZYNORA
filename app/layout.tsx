import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// Font configurations matching the luxury theme
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-lato", // keeping variable name to avoid global css refactor
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair", // keeping variable name to avoid global css refactor
});

export const metadata: Metadata = {
  title: "ZYNORA LUXE | India's Trusted Diamond Destination",
  description: "Luxury classic diamond jewelry at ZYNORA LUXE. Crafted for a lifetime.",
  icons: {
    icon: "/assets/logo.png"
  }
};

import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${cormorant.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
