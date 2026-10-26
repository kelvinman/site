import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "./PrintButton";
import { ABOUT, ALSO, ROLES } from "./cv";
import styles from "./cv.module.css";

// Unlisted: reachable by its link, but kept out of search results and the sitemap, and not
// linked from anywhere on the site.
export const metadata: Metadata = {
  title: "CV · Kelvin Man",
  description: "Kelvin Man, design engineer in Los Angeles.",
  robots: { index: false, follow: false },
};

export default function CV() {
  return (
    <main className={styles.page}>
      <div className={`${styles.sheet} reveal`}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.name}>Kelvin Man</h1>
            <p className={styles.role}>Design engineer, Los Angeles</p>
          </div>
          <p className={styles.links}>
            <a href="https://www.kelvinman.com">kelvinman.com</a>
            <br />
            <a href="mailto:hello@kelvinman.com">hello@kelvinman.com</a>
            <br />
            <a href="https://github.com/kelvinman">github.com/kelvinman</a>
          </p>
        </header>

        <section className={styles.about}>
          <h2 className={styles.label}>About</h2>
          <p>{ABOUT}</p>
        </section>

        <section className={styles.ledger} aria-label="Work">
          {ROLES.map((entry) => (
            <div key={entry.name} className={styles.row}>
              <span className={entry.current ? `${styles.years} ${styles.current}` : styles.years}>{entry.years}</span>
              <div className={styles.who}>
                <span className={styles.company}>{entry.href ? <a href={entry.href}>{entry.name}</a> : entry.name}</span>
                <span className={styles.title}>
                  {entry.role}
                  {entry.note && <span className={styles.note}>, {entry.note}</span>}
                </span>
              </div>
              <p className={styles.what}>{entry.what}</p>
            </div>
          ))}
        </section>

        {ALSO.map((item) => (
          <section key={item.label} className={styles.also}>
            <h2 className={styles.label}>{item.label}</h2>
            <p>{item.text}</p>
          </section>
        ))}

        <footer className={styles.footer}>
          <Link href="/">← Home</Link>
          <PrintButton />
        </footer>
      </div>
    </main>
  );
}
