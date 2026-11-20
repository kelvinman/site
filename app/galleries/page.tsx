import type { Metadata } from "next";
import { Nothing_You_Could_Do } from "next/font/google";
import Link from "next/link";
import { Galleries, type Visit } from "./Galleries";
import visits from "./visits.json";
import styles from "./galleries.module.css";

// The pencil hand the captions on the prints are written in, loaded on this page only. Kelvin
// picked it from six hands in four inks.
const hand = Nothing_You_Could_Do({ subsets: ["latin"], weight: "400", variable: "--font-hand", display: "swap" });

export const metadata: Metadata = {
  title: "Galleries · Kelvin Man",
  description: "Snapshots from galleries and museums around Los Angeles.",
  alternates: { canonical: "/galleries" },
};

export default function GalleriesPage() {
  return (
    <main className={`${styles.page} ${hand.variable} top-fade`}>
      <div className={`${styles.col} reveal`}>
        <header className={styles.header}>
          <Link href="/" className={styles.back}>
            ← Home
          </Link>
          <h1 className={styles.title}>Galleries</h1>
          <p className={styles.intro}>
            Snapshots from the galleries and museums I&apos;ve been to around Los Angeles, by the artists I saw there.
          </p>
        </header>
        <Galleries visits={visits as Visit[]} />
      </div>
    </main>
  );
}
