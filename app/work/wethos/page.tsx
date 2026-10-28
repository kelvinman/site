import type { Metadata } from "next";
import styles from "../../page.module.css";
import { NoteLayout } from "../../notes/NoteLayout";
import { MoreWork } from "../MoreWork";
import draft from "../decorx/decorx.module.css";

// From the Wethos entry on /work and in the CV, the customer story behind the Templates number, Al
// Huizenga's and Craig's kudos in my Notion hype doc, and my answers of 28 Oct 2026. The one screen
// is the Templates cover already on /work; more can come from my files. Behind the case study
// password; kept out of search.
export const metadata: Metadata = {
  title: "Wethos · Kelvin Man",
  description: "Templates that cut proposal writing from hours to one, and the design system behind them.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { id: "the-problem", title: "The problem" },
  { id: "templates", title: "Templates" },
  { id: "design-system", title: "The design system" },
  { id: "working-with-engineering", title: "With engineering" },
  { id: "what-i-learned", title: "What I learned" },
  { id: "more-work", title: "More work" },
];


/** A screen from Wethos. */
function Figure({ src, caption, width, height }: { src: string; caption: string; width: number; height: number }) {
  return (
    <figure className={draft.figure}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
      <img src={src} alt={caption} width={width} height={height} loading="lazy" />
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

export default function Wethos() {
  return (
    <NoteLayout sections={SECTIONS} back={{ href: "/work", label: "Work" }}>
      <header className={styles.header}>
        <h1 className={styles.name}>Wethos</h1>
        <p className={styles.meta}>Product designer, then senior product designer, 2020 to 2022</p>
      </header>

      <p className={styles.dash} aria-hidden="true">
        —
      </p>

      <p className={styles.body}>
        Wethos is a platform for freelancers and small studios to scope projects, staff them and split the payments. It
        was my only full-time job, before SuperNice. I led the design system and designed Templates, which customers
        credited with cutting proposal writing from five to seven hours down to one.
      </p>

      <Figure
        src="/work/cover-wethos.webp"
        caption="Templates: ready-made project scopes, each with a price, a team size and its phases."
        width={1400}
        height={906}
      />

      <Numbers
        items={[
          ["5–7 h → 1", "to write a proposal"],
          ["2 years", "full time"],
          ["Aug 2021", "Templates designed"],
        ]}
      />

      <h2 id="the-problem" className={styles.subhead}>
        The problem
      </h2>

      <p className={styles.body}>
        Before a freelancer can start a project, they have to win it, and that meant writing a proposal from a blank page:
        the scope, the phases, who does what, and what it costs. Every proposal was hours of unpaid work, and when a
        client never replied, those hours were just gone.
      </p>

      <p className={styles.body}>
        I knew it first-hand. I&apos;d freelanced since college, and I was still writing proposals of my own. At Wethos we
        talked to customers all the time, in interviews, surveys and customer stories, and they said the same.
      </p>

      <h2 id="templates" className={styles.subhead}>
        Templates
      </h2>

      <p className={styles.body}>
        Pricing was the hardest part of a proposal for most people. Wethos already had a modular way to put a project
        together and price it, with levers for time and effort. Templates sit on top of that: whole projects, a motion
        graphic or a paid social campaign, scoped and priced by people in the industry who do that work.
      </p>

      <p className={styles.body}>
        So a proposal starts from something real and gets adjusted rather than written from scratch, and a freelancer gets
        a sense of what to charge for that kind of project. A library like that didn&apos;t exist before.
      </p>

      <h2 id="design-system" className={styles.subhead}>
        The design system
      </h2>

      <p className={styles.body}>
        I led the design system: the Figma library we designed the product from and handed to engineering.
      </p>

      <h2 id="working-with-engineering" className={styles.subhead}>
        With engineering
      </h2>

      <p className={styles.body}>
        &ldquo;&hellip;for bringing the &lsquo;building contracts&rsquo; designs to the tech team early and often, and
        iterating to get to a model that&apos;s clear and simple and feasible.&rdquo; Al Huizenga, Director of Product
        Management.
      </p>

      <p className={styles.body}>
        &ldquo;&hellip;its been great getting to know you guys and the flow between design and dev at Wethos!&rdquo;
        Craig, December 2021.
      </p>

      <h2 id="what-i-learned" className={styles.subhead}>
        What I learned
      </h2>

      <p className={styles.body}>
        As much about running a business as about design. Talking to customers and building for them, I learned how
        people price a project, break it down, put a proposal together and win work.
      </p>

      <p className={styles.body}>
        Watching so many people build their own agencies on Wethos is what showed me I could do it myself. In June 2022
        I left to start SuperNice.
      </p>

      <p className={styles.body}>
        Want to walk through any of this? <a href="mailto:hello@kelvinman.com">hello@kelvinman.com</a>
      </p>

      <MoreWork slug="wethos" />
    </NoteLayout>
  );
}
