import Link from "next/link";
import styles from "./page.module.css";

/** Shown for any address that isn't a page on the site. */
export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.col}>
        <header className={styles.header}>
          <p className={styles.name}>Page not found</p>
          <p className={styles.meta}>404</p>
        </header>
        <p className={styles.body}>
          There&apos;s nothing here. <Link href="/">Go back home</Link>.
        </p>
      </div>
    </main>
  );
}
