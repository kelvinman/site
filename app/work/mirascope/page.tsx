import type { Metadata } from "next";
import styles from "../../page.module.css";
import { NoteLayout } from "../../notes/NoteLayout";
import { MoreWork } from "../MoreWork";
import draft from "../decorx/decorx.module.css";
import work from "../work.module.css";
import { ArtificeCard } from "./ArtificeCard";
import { ArtificeSteps } from "./ArtificeSteps";
import { LilypadJudge } from "./LilypadJudge";
import { LilypadPlayground } from "./LilypadPlayground";
import { LilypadTraces } from "./LilypadTraces";

// From the Mirascope entry on /work and in the CV, the [Mirascope] Lilypad file in
// Figma (page V5, the demos and stills), the studiosupernice.com case study, and my answers of
// 28 Oct 2026. Artifice is shown from the screenshots Will sent on 11 Feb 2023 for the website; the
// library from the Design Library V1 and V2 files; SOTAI's site from the studio's 2023 mockups (Drive,
// "SOTAI Scene"); the playground and tags from his Lilypad Looms of 11 Apr and 4 May 2025. Behind the
// case study password; kept out of search.
export const metadata: Metadata = {
  title: "Mirascope · Kelvin Man",
  description: "Five projects for an AI team, from no-code machine learning to tools for LLM developers.",
  robots: { index: false, follow: false },
  // The card sits outside /work/mirascope, so link previews can load it without the password.
  openGraph: { title: "Mirascope · Kelvin Man", url: "/work/mirascope", siteName: "Kelvin Man", type: "article", images: "/og/work-mirascope.png" },
  twitter: { card: "summary_large_image", images: "/og/work-mirascope.png" },
};

const SECTIONS = [
  { id: "where-they-were", title: "Where they were" },
  { id: "artifice", title: "Artifice" },
  { id: "design-library", title: "The design library" },
  { id: "website", title: "The websites" },
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
        Mirascope, which started as SOTAI, brought me back for five projects over two and a half years. I designed
        Artifice, a no-code platform for interpretable machine learning, and two versions of the design library behind
        their products. I designed their website twice, as SOTAI and again as Mirascope with a new logo. Most recently
        I designed Lilypad, an open-source tool for versioning, tracing and annotating LLM calls.
      </p>

      <LilypadTraces />

      <Numbers
        items={[
          ["2.5 years", "coming back"],
          ["5", "projects"],
          ["Apr 2023", "Artifice on Show HN"],
        ]}
      />

      <h2 id="where-they-were" className={styles.subhead}>
        Where they were
      </h2>

      <p className={styles.body}>
        Two founders out of Google AI, building tools for people who aren&apos;t data scientists. When I joined, they had a
        live product, a prototype and few customers yet. It worked, but it was written for people who already knew machine
        learning.
      </p>

      <p className={styles.body}>
        It took me a while to understand what the product did. That turned out to be the job: once I could follow it, I
        could reshape it so that someone who wasn&apos;t an engineer could follow it too.
      </p>

      <h2 id="artifice" className={styles.subhead}>
        Artifice
      </h2>

      <p className={styles.body}>
        Artifice let anyone build interpretable machine learning models without code: prepare the data, set the
        model&apos;s rules from what they already knew, train it, and see why it decides what it does. My part was
        making a very technical product approachable for people who aren&apos;t data scientists.
      </p>

      <ArtificeSteps />

      <h2 id="design-library" className={styles.subhead}>
        The design library
      </h2>

      <p className={styles.body}>
        I also designed the library that Artifice and Lilypad were built from. The first version, in late 2022, set
        the colors, the icons and the page patterns that every Artifice screen used. Every status used the same tag.
        It was gray before anything had run, orange while a job ran, and green when the job was done.
      </p>

      <ArtificeCard />

      <p className={styles.body}>
        The second version added AutoCM, a GPT assistant inside Artifice. It suggested the transforms, features and
        prediction for a dataset, and asked before running each one.
      </p>

      <h2 id="website" className={styles.subhead}>
        The websites
      </h2>

      <p className={styles.body}>
        I designed SOTAI&apos;s first website between December 2022 and January 2023, ahead of Artifice&apos;s
        launch. The home page put the product&apos;s own screens behind the headline.
      </p>

      <Figure
        src="sotai-website.webp"
        caption="SOTAI's home page, which I designed in early 2023, in a mockup made for the studio's portfolio."
        width={1224}
        height={821}
      />

      <p className={styles.body}>
        When SOTAI became Mirascope, I designed the new website and logo. The brief was for seasoned developers: playful
        but professional, never enterprisey. The name comes from the mirror toy that makes a 3D image, and from a joke
        about LLM tools being wrappers.
      </p>

      <Figure
        src="website.webp"
        caption="The home page I designed for Mirascope in January 2024."
        width={1224}
        height={756}
      />

      <p className={styles.body}>
        In April 2024 I designed their blog pages too, for a push on search.
      </p>

      <h2 id="lilypad" className={styles.subhead}>
        Lilypad
      </h2>

      <p className={styles.body}>
        When the team moved to LLM tools, the question was how to tell whether a new version of a prompt is better than
        the last. I expected a visual job and found a structural one, so I spent the first sprint on how the app was
        organized before how it looked. Calls waiting for review became an inbox, separate from the full list of
        traces. Comparing moved from a button to a tab and grew from two traces to many. Annotating became as simple as
        highlighting text in an answer. In the next round, each call was marked pass or fail against the team&apos;s own
        criteria, with a reason.
      </p>

      <LilypadJudge />

      <p className={styles.body}>
        I modeled the playground on Claude&apos;s console, where you edit a prompt and run it. Two versions sit side by
        side and run together, so the difference shows in one go. Tags moved out of each trace and into the
        organization&apos;s settings, so the whole team uses the same set.
      </p>

      <LilypadPlayground />

      <h2 id="what-shipped" className={styles.subhead}>
        What shipped
      </h2>

      <p className={styles.body}>
        I worked with them project by project, whenever they had something new to design.
      </p>

      <p className={styles.body}>
        <strong>Artifice</strong>, launched on{" "}
        <Out href="https://news.ycombinator.com/item?id=35742104">Hacker News</Out> in April 2023.{" "}
        <strong>Two versions of the design library</strong> behind their products. <strong>Two websites</strong>,
        SOTAI&apos;s in 2023 and Mirascope&apos;s, with its logo, in 2024. And <strong>Lilypad</strong>,
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

      <blockquote className={`${styles.body} ${work.quote}`}>
        <p>
          &ldquo;Kelvin is an exceptional designer who worked closely with us on various projects for SOTAI&hellip; he
          went above and beyond to ensure that we were completely satisfied with the final product.&rdquo;
        </p>
        <footer>William Bakst, co-founder</footer>
      </blockquote>

      <h2 id="what-i-learned" className={styles.subhead}>
        What I learned
      </h2>

      <p className={styles.body}>
        Designing Lilypad taught me how to tell whether an AI product is getting better. Lilypad records every model
        call, marks each answer good or bad, and compares one version with the last.
      </p>

      <p className={styles.body}>
        I took that loop to <a href="/work/decorx">DecorX</a>. Our image generation already had an automatic judge, but nothing to compare
        against. Now there&apos;s a fixed set of test images and a score we track, so we can tell whether a new model
        is actually better.
      </p>


      <MoreWork slug="mirascope" />
    </NoteLayout>
  );
}
