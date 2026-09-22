import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import FloatingTooltip from "@/components/FloatingTooltip";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#b70100",
};

export const metadata: Metadata = {
  title: "RedCross Blood Bank",
  description: "Blood Bank Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} font-sans text-stone-900 antialiased`}>
        {children}
        <FloatingTooltip />
      </body>
    </html>
  );
}
