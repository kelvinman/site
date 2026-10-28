import type { Metadata } from "next";
import styles from "../../page.module.css";
import { NoteLayout } from "../../notes/NoteLayout";
import draft from "../decorx/decorx.module.css";
import { ChatEstimate } from "./ChatEstimate";
import { Journey } from "./Journey";
import { RangePlot } from "./RangePlot";

// A local draft from the NYPP problem-framing board and Hi-Fi file in Figma, the nypd-payout-predictor
// and sidecar-legal repos, and the app run locally on 27 Oct 2026. Behind the case study password;
// kept out of search.
export const metadata: Metadata = {
  title: "Sidecar Legal · Kelvin Man",
  description: "Designing a payout estimator for people with a case against the NYPD.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { id: "the-question", title: "The question" },
  { id: "the-journey", title: "The journey" },
  { id: "the-design", title: "The design" },
  { id: "in-code", title: "In code" },
];

/** A still from the design files or the running app. */
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

export default function SidecarLegal() {
  return (
    <NoteLayout sections={SECTIONS} back={{ href: "/work", label: "Work" }}>
      <header className={styles.header}>
        <h1 className={styles.name}>Sidecar Legal</h1>
        <p className={styles.meta}>Product designer, 2025</p>
      </header>

      <p className={styles.dash} aria-hidden="true">
        —
      </p>

      <p className={styles.body}>
        The New York Payout Project tells someone with a case against the NYPD what similar cases actually settled for.
        Sidecar Legal built it with Cody Warner, P.C. I designed it, then helped build it in code.
      </p>

      <Figure
        src="/work/cover-sidecar.webp"
        caption="The home page, from the running app: describe your case, or browse the settlements."
        width={1400}
        height={856}
      />

      <Numbers
        items={[
          ["12,000+", "real NYPD settlements"],
          ["3", "steps to an estimate"],
          ["May to Oct", "2025, design into code"],
        ]}
      />

      <h2 id="the-question" className={styles.subhead}>
        The question
      </h2>

      <p className={styles.body}>
        People hurt by the police ask one thing first: is my case worth pursuing, and for roughly how much? They&apos;re
        also wary of legal advice from an AI. Working from Sidecar&apos;s product requirements, I pulled out three things
        the product had to get right: plain language with honest disclaimers, the real cases behind any number, and a
        clear way to a lawyer.
      </p>

      <h2 id="the-journey" className={styles.subhead}>
        The journey
      </h2>

      <p className={styles.body}>
        Before any screens, I mapped the journey stage by stage: what someone thinks, what could lose them, and what the
        design does about it.
      </p>

      <Journey />

      <h2 id="the-design" className={styles.subhead}>
        The design
      </h2>

      <p className={styles.body}>
        A short chat asks a few questions, with quick replies where it can. The result leads with a range, says plainly
        that it&apos;s an estimate, and shows the similar settlements it came from.
      </p>

      <ChatEstimate />

      <p className={styles.body}>
        Why a range, and not one number? Settlements for similar claims spread widely. Across the city&apos;s data, the
        middle half runs from $16,500 to $55,000, and federal cases spread wider than state ones. A single number would
        promise more than the data can.
      </p>

      <RangePlot />

      <h2 id="in-code" className={styles.subhead}>
        In code
      </h2>

      <p className={styles.body}>
        I set up the component library in React Aria and Storybook, then rebuilt the interface in Next.js: the case
        library and case pages, a PDF viewer for the court documents, the estimate summary, and a pass for mobile. Later
        I polished the Sidecar landing page the same way.
      </p>

      <p className={styles.body}>
        I worked with Sidecar&apos;s founders, Jon Tippens and Shruti Merchant, and with Allen Tang and David Marmaros on
        engineering.
      </p>

      <p className={styles.body}>
        Want to talk it through? <a href="mailto:hello@kelvinman.com">hello@kelvinman.com</a>
      </p>
    </NoteLayout>
  );
}
