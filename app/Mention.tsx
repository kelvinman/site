import Link from "next/link";
import { NOTES } from "./notes/notes";
import { OWN, PROJECTS } from "./work/projects";

/** A link, inside a note's text, to another note or to something I made, named by its slug. A note
 * opens at /notes/<slug> and a project at its entry on /work, which is public even where the case
 * study has a password. The hover card comes from LinkPeek, and the page on the other end lists the
 * note back (app/mentions.ts), so this one link connects both sides. An unknown slug fails the build
 * rather than shipping a dead link. */
export function Mention({ to, children }: { to: string; children: React.ReactNode }) {
  const href = NOTES.some((note) => note.slug === to)
    ? `/notes/${to}`
    : [...PROJECTS, ...OWN].some((project) => project.slug === to)
      ? `/work#${to}`
      : null;
  if (!href) throw new Error(`<Mention to="${to}">: no note or project with that slug`);
  return <Link href={href}>{children}</Link>;
}
