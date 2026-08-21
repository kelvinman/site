import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.col}>
        <header className={styles.header}>
          <p className={styles.name}>Kelvin Man</p>
          <p className={styles.meta}>Updated Aug 2026</p>
        </header>

        <p className={styles.dash} aria-hidden="true">
          —
        </p>

        <p className={styles.body}>
          I&apos;m building{" "}
          <a
            href="https://studiosupernice.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            SuperNice
          </a>
          , a product studio based in Los Angeles, CA. Previously collaborated
          with talented teams at{" "}
          <a href="https://meta.com" target="_blank" rel="noopener noreferrer">
            Meta
          </a>
          ,{" "}
          <a
            href="https://salesforce.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Salesforce
          </a>
          ,{" "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          , Moment (acquired by{" "}
          <a
            href="https://www.patreon.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Patreon
          </a>
          ),{" "}
          <a
            href="https://www.triumphlabs.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Triumph
          </a>
          , and more.
        </p>

        <p className={styles.body}>
          Find me on{" "}
          <a
            href="https://x.com/0xkelvin"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>{" "}
          or reach me at{" "}
          <a href="mailto:hello@kelvinman.com">hello@kelvinman.com</a>.
        </p>
      </div>
    </main>
  );
}
