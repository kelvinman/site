import type { Metadata } from "next";
import { Hanken_Grotesk, Inconsolata } from "next/font/google";
import "./globals.css";

const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--font-inconsolata",
  display: "swap",
});

// The reading font. Everything around the sentences stays in Inconsolata.
const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kelvin Man",
  description:
    "Design engineer in Los Angeles, running SuperNice, a product studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inconsolata.variable} ${hankenGrotesk.variable}`}>
      <body className={inconsolata.className}>{children}</body>
    </html>
  );
}
