import Link from "next/link";
import styles from "./page.module.css";
import { NOTES } from "./notes/notes";
import { WORK } from "./work";

/** Opens in a new tab, for links that leave the site. */
function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={`${styles.col} reveal`}>
        <header className={styles.header}>
          <p className={styles.name}>Kelvin Man</p>
          <p className={styles.meta}>Design engineer, Los Angeles</p>
        </header>

        <p className={styles.dash} aria-hidden="true">
          —
        </p>

        <p className={styles.body}>
          I&apos;m the founding design engineer at{" "}
          <Out href="https://www.decorx.com">DecorX</Out>, and I run{" "}
          <Out href="https://studiosupernice.com">SuperNice</Out>, a product
          studio.
        </p>

        <p className={styles.body}>
          I studied informatics, started out writing front-end code, moved
          into product, and taught myself design. Along the way I&apos;ve worked
          with teams at <Out href="https://meta.com">Meta</Out>,{" "}
          <Out href="https://snap.com">Snap</Out>,{" "}
          <Out href="https://microsoft.com">Microsoft</Out>,{" "}
          <Out href="https://salesforce.com">Salesforce</Out>,{" "}
          <Out href="https://github.com">GitHub</Out>, Moment (acquired by{" "}
          <Out href="https://www.patreon.com">Patreon</Out>),{" "}
          <Out href="https://mirascope.com">Mirascope</Out>, and more.
        </p>

        <p className={styles.body}>
          Find me on <Out href="https://github.com/kelvinman">GitHub</Out>,{" "}
          <Out href="https://linkedin.com/in/0xkelvin">LinkedIn</Out> or{" "}
          <Out href="https://x.com/0xkelvin">Twitter</Out>, or reach me at{" "}
          <a href="mailto:hello@kelvinman.com">hello@kelvinman.com</a>.
        </p>

        <section className={styles.section} aria-labelledby="work">
          <h2 id="work" className={styles.label}>
            Work
          </h2>
          <ul className={styles.work}>
            {WORK.map((entry) => (
              <li key={entry.name}>
                <span className={styles.role}>
                  {entry.role}
                  <span className={styles.slash}> / </span>
                </span>
                <span className={styles.place}>{entry.href ? <Out href={entry.href}>{entry.name}</Out> : entry.name}</span>
                <span className={styles.leader} aria-hidden="true" />
                <span className={styles.years}>{entry.years}</span>
              </li>
            ))}
          </ul>
          <p className={styles.summary}>More work I can walk through on a call.</p>
        </section>

        <section className={styles.section} aria-labelledby="notes">
          <h2 id="notes" className={styles.label}>
            Notes
          </h2>
          <ul className={styles.notes}>
            {NOTES.map((note) => (
              <li key={note.slug}>
                <Link href={`/notes/${note.slug}`}>{note.title}</Link>
                <span className={styles.summary}>{note.summary}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
