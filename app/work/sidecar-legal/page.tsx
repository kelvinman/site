import type { Metadata } from "next";
import styles from "../../page.module.css";
import { NoteLayout } from "../../notes/NoteLayout";
import { MoreWork } from "../MoreWork";
import draft from "../decorx/decorx.module.css";
import { ChatEstimate } from "./ChatEstimate";
import { Journey } from "./Journey";
import { Landscape } from "./Landscape";
import { NewCase } from "./NewCase";
import { NewDraft } from "./NewDraft";
import { ObjectMap } from "./ObjectMap";
import { OutlineView } from "./OutlineView";
import { RangePlot } from "./RangePlot";
import { ReviewEdits } from "./ReviewEdits";
import { Timeline } from "./Timeline";
import { Welcome } from "./Welcome";

// The drafting tool sections draw on his first draft walkthrough (9 May 2025), his Looms of 19 and
// 30 May 2025, the [OAI Legal] and [Sidecar] Figma files, and his email with the founders. The
// founders' PRD and brand answers are paraphrased only, never quoted.
// A local draft from the NYPP problem-framing board and Hi-Fi file in Figma, the nypd-payout-predictor
// and sidecar-legal repos, and the app run locally on 27 Oct 2026. Behind the case study password;
// kept out of search.
export const metadata: Metadata = {
  title: "Sidecar Legal · Kelvin Man",
  description: "Designing an AI drafting tool for litigators inside Microsoft Word, and a payout estimator for people with a case against the NYPD.",
  robots: { index: false, follow: false },
  // The card sits outside /work/sidecar-legal, so link previews can load it without the password.
  openGraph: { title: "Sidecar Legal · Kelvin Man", url: "/work/sidecar-legal", siteName: "Kelvin Man", type: "article", images: "/og/work-sidecar-legal.png" },
  twitter: { card: "summary_large_image", images: "/og/work-sidecar-legal.png" },
};

const SECTIONS = [
  { id: "the-drafting-tool", title: "The drafting tool" },
  { id: "learning-the-product", title: "Learning the product" },
  { id: "getting-started", title: "Getting started" },
  { id: "inside-word", title: "Inside Word" },
  { id: "reviewing-edits", title: "Reviewing the AI's edits" },
  { id: "how-i-worked", title: "How I worked" },
  { id: "the-payout-project", title: "The payout project" },
  { id: "the-question", title: "The question" },
  { id: "the-journey", title: "The journey" },
  { id: "the-design", title: "The design" },
  { id: "in-code", title: "In code" },
  { id: "more-work", title: "More work" },
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
        <p className={styles.meta}>Senior product designer, 2025</p>
      </header>

      <p className={styles.dash} aria-hidden="true">
        —
      </p>

      <p className={styles.body}>
        Sidecar Legal made an AI drafting tool for litigators that worked inside Microsoft Word. I designed it through my
        studio, SuperNice, from May 2025. Later I designed Sidecar&apos;s New York Payout Project and helped build it in
        code.
      </p>

      <Figure
        src="/work/sidecar-legal/improvement.webp"
        caption="An improvement Sidecar suggested, with its citations and the source document beside the draft."
        width={1400}
        height={1211}
      />

      <Numbers
        items={[
          ["22", "drafting tools compared"],
          ["2", "products designed"],
          ["May to Oct", "2025, design into code"],
        ]}
      />

      <h2 id="the-drafting-tool" className={styles.subhead}>
        The drafting tool
      </h2>

      <p className={styles.body}>
        Sidecar&apos;s tool ran inside Word. A litigator picked a case, a template and the case files, and Sidecar
        drafted the document. Then it suggested improvements, each with its sources.
      </p>

      <p className={styles.body}>
        Shruti Merchant and Jon Tippens, Sidecar&apos;s founders, had the idea, a product plan and early designs. They
        brought me in to make the add-in clear to lawyers, who are wary of new tools, and convincing in a demo.
      </p>

      <h2 id="learning-the-product" className={styles.subhead}>
        Learning the product
      </h2>

      <p className={styles.body}>
        I started with an audit of the live add-in, then rebuilt its interface in Figma so I could change it quickly.
        Next I went through other legal drafting tools, most of them Word add-ins, and kept notes on the ones that
        worked well.
      </p>

      <Landscape />

      <p className={styles.body}>
        Then I mapped the product&apos;s objects and how they relate to each other.
      </p>

      <ObjectMap />

      <p className={styles.body}>
        The map changed how the add-in was organized. Templates and past responses moved into one place, and each
        case&apos;s files moved under the case.
      </p>

      <h2 id="getting-started" className={styles.subhead}>
        Getting started
      </h2>

      <p className={styles.body}>
        I designed for lawyers already using Sidecar first, since that&apos;s where the product is strongest. Then I
        flagged what a new user would need to get there without help, which was a sample case and ready templates.
      </p>

      <p className={styles.body}>
        The welcome screen offers three ways in, each with a shortcut. A beginner and pro switch decides how much it
        explains.
      </p>

      <Welcome />

      <p className={styles.body}>
        A new case starts with its files. The add-in shows which files that kind of document needs, required or
        recommended. Sidecar then reads them and suggests the case name and client type, and the lawyer confirms or
        changes them.
      </p>

      <NewCase />

      <h2 id="inside-word" className={styles.subhead}>
        Inside Word
      </h2>

      <p className={styles.body}>
        Starting a draft asks for the case first, then the template, and both lists can be searched as a firm&apos;s
        cases grow. I added a step to save the document, because it always had to be saved before Sidecar could draft
        into it.
      </p>

      <p className={styles.body}>
        While Sidecar drafts, nothing covers the page, so the lawyer can keep working. I also suggested filling the
        draft in item by item, so there is something to read before it finishes.
      </p>

      <NewDraft />

      <p className={styles.body}>
        Shruti set the rule for the look. Anything Word already has, such as an outline, should look like Word.
        Sidecar&apos;s own character goes only on new things. So the outline nests like Word&apos;s, with lines that
        show the levels, and the add-in has a dark mode to match Word&apos;s.
      </p>

      <p className={styles.body}>
        I also swapped a half-filled progress circle for a counter, such as 1 of 4. A lawyer reads it at a glance,
        with nothing new to learn.
      </p>

      <OutlineView />

      <h2 id="reviewing-edits" className={styles.subhead}>
        Reviewing the AI&apos;s edits
      </h2>

      <p className={styles.body}>
        Each improvement got its own step, with the source it cites beside it. Grouping small improvements came up,
        and I argued against it. Grouping only makes the work look smaller, and a lawyer still has to check every
        change.
      </p>

      <p className={styles.body}>
        After feedback from an attorney, we broke long citations into smaller improvements and added a view of all
        the sources. A plain text copy of each source sits beside its PDF. For the PDF itself, I argued for a popup,
        because the add-in&apos;s narrow default width is too tight to read a page in.
      </p>

      <ReviewEdits />

      <h2 id="how-i-worked" className={styles.subhead}>
        How I worked
      </h2>

      <p className={styles.body}>
        I shared most rounds with Shruti and Jon as recorded walkthroughs, and they answered by email and in Figma
        comments. Their notes, and an attorney&apos;s feedback, changed the design as we went.
      </p>

      <Timeline />

      <p className={styles.body}>
        The product thinking behind the drafting tool is Shruti&apos;s and Jon&apos;s. E&amp;W Design Studio made
        Sidecar&apos;s brand.
      </p>

      <h2 id="the-payout-project" className={styles.subhead}>
        The payout project
      </h2>

      <p className={styles.body}>
        Alongside the drafting tool, Sidecar built the New York Payout Project with Cody Warner, P.C. It tells someone
        with a case against the NYPD what similar cases actually settled for. I designed it, then helped build it in
        code.
      </p>

      <Figure
        src="/work/cover-sidecar.webp"
        caption="The home page, where you describe your case or browse the settlements."
        width={1400}
        height={856}
      />

      <Numbers
        items={[
          ["12,000+", "real NYPD settlements"],
          ["3", "steps to an estimate"],
          ["Aug to Oct", "2025, in code"],
        ]}
      />

      <h2 id="the-question" className={styles.subhead}>
        The question
      </h2>

      <p className={styles.body}>
        People hurt by the police ask one thing first: is my case worth pursuing, and for roughly how much? They&apos;re
        also wary of legal advice from an AI. Working from Sidecar&apos;s product requirements, I pulled out three things the product had to get right. It had to speak plainly with honest disclaimers, show the real cases behind any number, and make it easy to reach a lawyer.
      </p>

      <h2 id="the-journey" className={styles.subhead}>
        The journey
      </h2>

      <p className={styles.body}>
        Before designing any screens, I went through the journey stage by stage. At each one, I wrote down what the
        person is thinking and what might put them off. Then I decided how the design would answer each of those
        doubts.
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
        I set up the component library in React Aria and Storybook, then built the interface in Next.js. I built the
        case library and case pages, a PDF viewer for the court documents and the estimate summary, and made it all
        work on mobile. Later I polished the Sidecar landing page the same way.
      </p>

      <p className={styles.body}>
        I worked with Shruti and Jon throughout, and with Allen Tang and David Marmaros on engineering.
      </p>

      <MoreWork slug="sidecar-legal" />
    </NoteLayout>
  );
}
