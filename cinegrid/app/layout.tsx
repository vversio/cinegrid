import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const starlord = localFont({
  src: "../public/starlord-font/Starlord Italic.ttf",
  variable: "--font-starlord",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CineGrid - Track Your Movies",
  description: "Track your watched movies and visualize your viewing patterns over time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${starlord.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
