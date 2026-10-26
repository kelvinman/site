import styles from "../page.module.css";
import { NOTES, formatNoteDate } from "./notes";

/** The top of every note: the title and the date, then the site's dash. The way back home is in NoteLayout. */
export function NoteHeader({ slug }: { slug: string }) {
  const note = NOTES.find((entry) => entry.slug === slug);
  if (!note) throw new Error(`No note called ${slug} in notes.ts`);
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.name}>{note.title}</h1>
        <p className={styles.meta}>{formatNoteDate(note.date)}</p>
      </header>

      <p className={styles.dash} aria-hidden="true">
        —
      </p>
    </>
  );
}
