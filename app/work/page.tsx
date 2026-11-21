import type { Metadata } from "next";
import Link from "next/link";
import home from "../page.module.css";
import { mentionsOf } from "../mentions";
import { NoteLayout } from "../notes/NoteLayout";
import { OWN, PROJECTS, type Cover, type Link as Out, type Project } from "./projects";
import styles from "./work.module.css";

export const metadata: Metadata = {
  title: "Work · Kelvin Man",
  description: "What Kelvin Man has designed and built, role by role.",
  // Shared by link, like the CV: reachable, but kept out of search.
  robots: { index: false, follow: false },
};

/** Links under a role: out to another site in a new tab, or to a page on this one in place. Plain underlined
 * words with no arrows, and no preview card on hover (data-no-peek). The case study comes first, as a plain
 * link rather than a client-side one, so its password check runs on the way in. */
function Links({ links, caseStudy }: { links: Out[]; caseStudy?: string }) {
  return (
    <p className={styles.links}>
      {caseStudy && (
        <a href={caseStudy} data-no-peek>
          Case study
        </a>
      )}
      {links.map((link) =>
        link.href.startsWith("/") ? (
          <Link key={link.href} href={link.href} data-no-peek>
            {link.label}
          </Link>
        ) : (
          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" data-no-peek>
            {link.label}
          </a>
        ),
      )}
    </p>
  );
}

/** What to call a role's own link: the company's website, or the place a side project lives. */
function siteLabel(href: string) {
  if (href.startsWith("/")) return "See it live";
  if (href.includes("github.com")) return "GitHub";
  if (href.includes("figma.com")) return "Figma Community";
  return "Website";
}

/** The role's cover image, linking to its case study when there is one. */
function CoverImage({ cover, href }: { cover: Cover; href?: string }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
    <img
      src={cover.src}
      alt={cover.alt}
      width={cover.width}
      height={cover.height}
      loading="lazy"
      className={cover.bare ? styles.bare : undefined}
    />
  );
  return (
    <div className={styles.cover}>
      {href ? (
        // A plain link, not a client-side one, so the case study password check runs on the way in.
        <a href={href} aria-label="Read the case study">
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
}

function Entry({ project }: { project: Project }) {
  // Notes that mention this entry link to it, so it links back to them after its own links.
  // The name is plain text; its link sits first among the role's links, named for where it goes.
  const site = project.href ? { label: siteLabel(project.href), href: project.href } : undefined;
  const links = [
    ...(site ? [site] : []),
    ...(project.links ?? []),
    // A note's title alone reads like a slogan in a row of links, so one note is just "Note".
    ...mentionsOf(project.slug).map((note, _, all) => ({ label: all.length > 1 ? `Note: ${note.title}` : "Note", href: `/notes/${note.slug}` })),
  ];
  return (
    <article id={project.slug} className={styles.project}>
      <div className={styles.head}>
        <h2 className={styles.name}>{project.name}</h2>
        <span className={styles.leader} aria-hidden="true" />
        <span className={styles.years}>{project.years}</span>
      </div>
      <p className={styles.role}>{project.role}</p>
      {project.cover && (
        <CoverImage cover={project.cover} href={project.caseStudy ? `/work/${project.slug}` : undefined} />
      )}
      <p className={styles.text}>{project.summary}</p>

      {/* The links for the whole role sit under its summary, before the parts, so none reads as one part's. */}
      {(project.caseStudy || links.length > 0) && (
        <Links links={links} caseStudy={project.caseStudy ? `/work/${project.slug}` : undefined} />
      )}

      {project.parts && (
        <ul className={styles.parts}>
          {project.parts.map((part) => (
            <li key={part.title}>
              <span className={styles.partTitle}>{part.title}</span>
              {part.text && <span className={styles.partText}>{part.text}</span>}
              {part.image && <CoverImage cover={part.image} />}
              {part.links && <Links links={part.links} />}
            </li>
          ))}
        </ul>
      )}

      {project.shots?.map((shot) => (
        <figure key={shot.src} className={styles.shot}>
          <img src={shot.src} alt={shot.caption} width={shot.width} height={shot.height} loading="lazy" />
          <figcaption className={styles.caption}>{shot.caption}</figcaption>
        </figure>
      ))}

      {project.quote && (
        <blockquote className={styles.quote}>
          <p>&ldquo;{project.quote.text}&rdquo;</p>
          <footer>{project.quote.who}</footer>
        </blockquote>
      )}

    </article>
  );
}

/** The contents rail: one entry per role, then my own projects, so every entry on the page is in it. */
const SECTIONS = [...PROJECTS, ...OWN].map((project) => ({ id: project.slug, title: project.name }));

export default function Work() {
  return (
    <NoteLayout sections={SECTIONS}>
      <header className={home.header}>
        <h1 className={home.name}>Work</h1>
        <p className={home.meta}>Roles and projects, newest first</p>
      </header>

      <p className={home.body}>
        Most of this came through <a href="https://studiosupernice.com">SuperNice</a>, the product studio I run,
        usually as the only designer on the team, and often the one building it too.
      </p>

      {PROJECTS.map((project) => (
        <Entry key={project.slug} project={project} />
      ))}

      <section className={`${home.section} ${styles.own}`} aria-labelledby="own">
        <h2 id="own" className={home.label}>
          My own
        </h2>
        {OWN.map((project) => (
          <Entry key={project.slug} project={project} />
        ))}
      </section>
    </NoteLayout>
  );
}
