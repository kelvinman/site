import type { Metadata, Viewport } from "next";
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

const description = "Design engineer in Los Angeles, running SuperNice, a product studio.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kelvinman.com"),
  title: "Kelvin Man",
  description,
  openGraph: { title: "Kelvin Man", description, url: "/", siteName: "Kelvin Man", type: "website" },
  twitter: { card: "summary_large_image", creator: "@0xKelvin" },
};

// The browser's toolbar on phones takes the page's background colour.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1a18" },
  ],
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
