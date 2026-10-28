import type { Metadata } from "next";
import styles from "../../page.module.css";
import { NoteLayout } from "../../notes/NoteLayout";
import { MoreWork } from "../MoreWork";
import draft from "../decorx/decorx.module.css";
import { LilypadJudge } from "./LilypadJudge";
import { LilypadTraces } from "./LilypadTraces";

// From the Mirascope entry on /work and in the CV, the [Mirascope] Lilypad file in
// Figma (page V5, the demos and stills), the studiosupernice.com case study, and my answers of
// 28 Oct 2026. Artifice is told in words only, since its Figma file holds the old UI. Behind the case
// study password; kept out of search.
export const metadata: Metadata = {
  title: "Mirascope · Kelvin Man",
  description: "Three projects for an AI team, from no-code machine learning to tools for LLM developers.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { id: "where-they-were", title: "Where they were" },
  { id: "artifice", title: "Artifice" },
  { id: "lilypad", title: "Lilypad" },
  { id: "what-shipped", title: "What shipped" },
  { id: "what-i-learned", title: "What I learned" },
  { id: "more-work", title: "More work" },
];


/** A still from the Lilypad design file. */
function Figure({ src, caption, width, height }: { src: string; caption: string; width: number; height: number }) {
  return (
    <figure className={draft.figure}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
      <img src={`/work/mirascope/${src}`} alt={caption} width={width} height={height} loading="lazy" />
      <figcaption className={draft.caption}>{caption}</figcaption>
    </figure>
  );
}

/** Headline numbers: large figures over short labels, in one row. */
function Numbers({ items }: { items: [string, string][] }) {
  return (
    <div className={draft.stats} style={{ "--count": items.length } as React.CSSProperties}>
      {items.map(([n, l]) => (
        <div key={l}>
          <b>{n}</b>
          <span>{l}</span>
        </div>
      ))}
    </div>
  );
}

/** Opens in a new tab, for links that leave the site. */
function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Mirascope() {
  return (
    <NoteLayout sections={SECTIONS} back={{ href: "/work", label: "Work" }}>
      <header className={styles.header}>
        <h1 className={styles.name}>Mirascope</h1>
        <p className={styles.meta}>Senior product designer, 2022 to 2025</p>
      </header>

      <p className={styles.dash} aria-hidden="true">
        —
      </p>

      <p className={styles.body}>
        Mirascope, which started as SOTAI, brought me back for three projects over two and a half years: Artifice, a
        no-code platform for interpretable machine learning; the design library behind their products, through two
        versions; and Lilypad, an open-source tool for versioning, tracing and annotating LLM calls.
      </p>

      <LilypadTraces />

      <Numbers
        items={[
          ["2.5 years", "coming back"],
          ["3", "projects"],
          ["Apr 2023", "Artifice on Show HN"],
        ]}
      />

      <h2 id="where-they-were" className={styles.subhead}>
        Where they were
      </h2>

      <p className={styles.body}>
        Two founders out of Google AI, building tools for people who aren&apos;t data scientists. When I joined, they had a
        live product, a prototype and few customers yet. It worked, but it spoke the language of the engineers who built
        it.
      </p>

      <p className={styles.body}>
        I was still very much a designer then, not technical, and it took me a long time to understand what the product
        did. That turned out to be the job: once I could follow it, I could reshape it so that someone who wasn&apos;t
        an engineer could follow it too.
      </p>

      <h2 id="artifice" className={styles.subhead}>
        Artifice
      </h2>

      <p className={styles.body}>
        Artifice let anyone build interpretable machine learning models without code: prepare the data, set the
        model&apos;s rules from what they already knew, train it, and see why it decides what it does. My part was
        making a very technical product approachable, a way to demystify AI models for people who aren&apos;t data
        scientists, and designing the library both products were built from.
      </p>

      <h2 id="lilypad" className={styles.subhead}>
        Lilypad
      </h2>

      <p className={styles.body}>
        When the team moved to LLM tools, the question was how to tell whether a new version of a prompt is better than
        the last. In Lilypad, judging an answer happens right beside it: each call in the annotation queue is marked
        pass or fail against the team&apos;s own criteria, with a reason, so versions get compared on evidence, not a
        feeling.
      </p>

      <LilypadJudge />

      <h2 id="what-shipped" className={styles.subhead}>
        What shipped
      </h2>

      <p className={styles.body}>
        <strong>Artifice</strong>, launched on{" "}
        <Out href="https://news.ycombinator.com/item?id=35742104">Hacker News</Out> in April 2023.{" "}
        <strong>Two versions of the design library</strong> behind their products. And <strong>Lilypad</strong>,
        open source alongside <Out href="https://github.com/Mirascope/mirascope">Mirascope</Out>, the team&apos;s LLM
        toolkit, which has 1.5k stars on GitHub.
      </p>

      <Figure
        src="overview.webp"
        caption="A function in Lilypad: its code, and what each version costs and how fast it runs, day by day."
        width={1224}
        height={816}
      />
      <Figure
        src="annotate.webp"
        caption="The annotation queue as designed: calls waiting for review, each marked against the team's criteria."
        width={1224}
        height={816}
      />

      <p className={styles.body}>
        Project by project, whenever they had something new to shape. &ldquo;Kelvin is an exceptional designer who
        worked closely with us on various projects for SOTAI&hellip; he went above and beyond to ensure that we were
        completely satisfied with the final product.&rdquo; William Bakst, co-founder.
      </p>

      <h2 id="what-i-learned" className={styles.subhead}>
        What I learned
      </h2>

      <p className={styles.body}>
        How to design for a really complicated problem: simplify it until I truly understand it, and then make it
        something other people can understand too.
      </p>

      <p className={styles.body}>
        Want to walk through any of this? <a href="mailto:hello@kelvinman.com">hello@kelvinman.com</a>
      </p>

      <MoreWork slug="mirascope" />
    </NoteLayout>
  );
}
