import Link from "next/link";
import styles from "../page.module.css";
import { PROJECTS } from "./projects";
import more from "./more.module.css";

/** The other case studies, at the end of each one, starting with the next in the /work order and
 *  coming round to the one before, so a reader can go straight on. Each is named with its one line
 *  from projects.ts. Its heading has the id "more-work", for the contents list beside the page. */
export function MoreWork({ slug }: { slug: string }) {
  const studies = PROJECTS.filter((p) => p.caseStudy);
  const at = studies.findIndex((p) => p.slug === slug);
  const others = [...studies.slice(at + 1), ...studies.slice(0, Math.max(at, 0))];

  return (
    <>
      <h2 id="more-work" className={styles.subhead}>
        More work
      </h2>
      <ul className={more.list}>
        {others.map((p) => (
          <li key={p.slug}>
            <Link href={`/work/${p.slug}`}>{p.name}</Link>
            {p.line && <span className={styles.body}>{p.line}</span>}
          </li>
        ))}
      </ul>
    </>
  );
}
