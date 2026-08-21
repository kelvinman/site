import type { Metadata } from "next";
import { Inconsolata } from "next/font/google";
import "./globals.css";

const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kelvin Man",
  description:
    "Founder of SuperNice, a product studio based in Los Angeles, CA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inconsolata.variable}>
      <body className={inconsolata.className}>{children}</body>
    </html>
  );
}
