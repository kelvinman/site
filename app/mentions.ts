import { readFileSync } from "node:fs";
import path from "node:path";
import { NOTES, type Note } from "./notes/notes";

/** The published notes that are about a note or project, or mention it with a <Mention to="…"> link in
 * their page, read at build time. Drafts aren't in notes.ts, so their links count once they're published. */
export function mentionsOf(slug: string): Note[] {
  return NOTES.filter(
    (note) =>
      note.slug !== slug &&
      (note.about === slug ||
        readFileSync(path.join(process.cwd(), "app/notes", note.slug, "page.tsx"), "utf8").includes(`<Mention to="${slug}"`)),
  );
}
