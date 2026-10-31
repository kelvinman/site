import Link from "next/link";
import styles from "../page.module.css";
import { mentionsOf } from "../mentions";

/** The end of a note: the other notes that link to it, so a reader can follow the thread back.
 * Nothing when none do. */
export function MentionedIn({ slug }: { slug: string }) {
  const notes = mentionsOf(slug);
  if (!notes.length) return null;
  return (
    <p className={styles.meta}>
      Mentioned in{" "}
      {notes.map((note, i) => (
        <span key={note.slug}>
          {i > 0 && ", "}
          <Link href={`/notes/${note.slug}`}>{note.title}</Link>
        </span>
      ))}
    </p>
  );
}
