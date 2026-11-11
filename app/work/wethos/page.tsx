import type { Metadata } from "next";
import styles from "../../page.module.css";
import { NoteLayout } from "../../notes/NoteLayout";
import { MoreWork } from "../MoreWork";
import draft from "../decorx/decorx.module.css";
import { TemplateDemo } from "./TemplateDemo";
import work from "../work.module.css";
import wethos from "./wethos.module.css";
import { DesignSystem } from "./DesignSystem";
import { InvoiceDemo } from "./InvoiceDemo";
import { Website } from "./Website";

// From the Wethos entry on /work and in the CV, the customer story behind the Templates number, Al
// Huizenga's and Craig's kudos in my Notion hype doc, and my answers of 28 Oct 2026. The one screen
// is the Templates cover already on /work; more can come from my files. Behind the case study
// password; kept out of search.
export const metadata: Metadata = {
  title: "Wethos · Kelvin Man",
  description: "Templates that cut proposal writing from hours to one, and the design system behind them.",
  robots: { index: false, follow: false },
  // The card sits outside /work/wethos, so link previews can load it without the password.
  openGraph: { title: "Wethos · Kelvin Man", url: "/work/wethos", siteName: "Kelvin Man", type: "article", images: "/og/work-wethos.png" },
  twitter: { card: "summary_large_image", images: "/og/work-wethos.png" },
};

const SECTIONS = [
  { id: "the-problem", title: "The problem" },
  { id: "scoping", title: "Scoping" },
  { id: "templates", title: "Templates" },
  { id: "design-system", title: "The design system" },
  { id: "website", title: "The website" },
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
          ["1 hour", "to write a proposal, down from 5 to 7"],
          ["2 years", "full time"],
          ["Aug 2021", "templates designed"],
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

      <figure className={draft.figure}>
        <div className={wethos.paper}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
          <img
            src="/work/wethos/early-proposal.webp"
            alt="The first page of a proposal I wrote in 2020, with the client's details hidden"
            width={1200}
            height={1500}
            loading="lazy"
          />
        </div>
        <figcaption className={draft.caption}>
          One of my own proposals from 2020, before Wethos: the context, the phases and the timeline, all written by
          hand. The client&apos;s details are hidden.
        </figcaption>
      </figure>

      <h2 id="scoping" className={styles.subhead}>
        Scoping
      </h2>

      <p className={styles.body}>
        Every project on Wethos starts as a scope: the phases, the services in each, who does them and what they cost.
        Wethos already scoped projects this way, priced in points and dollars. I redesigned the scope builder so it
        would work on a phone too. The team chose to build a web app rather than a native one, so one design had to
        work on both. The rule I set was one way to do one thing, with the desktop matching mobile as much as possible.
      </p>

      <figure className={draft.figure}>
        <div className={wethos.pair}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
          <img
            src="/work/wethos/scope-web.webp"
            alt="The scope builder on web: planned budget, phase breakdown, the scope by phase and the services library"
            width={1280}
            height={720}
            loading="lazy"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
          <img
            src="/work/wethos/scope-mobile.webp"
            alt="The same scope on a phone"
            width={320}
            height={568}
            loading="lazy"
          />
        </div>
        <figcaption className={draft.caption}>The redesigned scope builder, August 2021, on web and on a phone.</figcaption>
      </figure>

      <h2 id="templates" className={styles.subhead}>
        Templates
      </h2>

      <p className={styles.body}>
        Pricing was the hardest part of a proposal for most people. Wethos already had a modular way to put a project
        together and price it, with levers for time and effort. Templates were built on that system. Each one is a whole
        project, such as a motion graphic or a paid social campaign, scoped and priced by people in the industry who do
        that work.
      </p>

      <p className={styles.body}>
        So a proposal starts from something real and gets adjusted rather than written from scratch, and a freelancer gets
        a sense of what to charge for that kind of project. A library like that didn&apos;t exist before.
      </p>

      <p className={styles.body}>
        Before they launched, I invited our user research club to try the new experience, and 23 people said yes, 17 of
        them the same day. Templates launched in August 2021 with 60 pre-priced scopes and 600 services to build from.
      </p>

      <TemplateDemo />

      <h2 id="design-system" className={styles.subhead}>
        The design system
      </h2>

      <p className={styles.body}>
        I led the design system: the Figma library we designed the product from and handed to engineering.
      </p>

      <DesignSystem />

      <p className={styles.body}>
        Other parts of Wethos reused the phase and service components I designed for scoping. The invoice builder was
        one, so a freelancer could bill for services straight from their scope.
      </p>

      <blockquote className={`${styles.body} ${work.quote}`}>
        <p>
          &ldquo;You put an incredible amount of work into creating new service and phase components that have already
          translated to other areas of the platform (invoice builder!). Creating these components and thinking about
          them in a modular way saves so much time&hellip;&rdquo;
        </p>
        <footer>Bo Schlagel, Director of Design</footer>
      </blockquote>

      <InvoiceDemo />

      <h2 id="website" className={styles.subhead}>
        The website
      </h2>

      <p className={styles.body}>
        I also designed the Wethos website. In 2020 I designed its home, pricing and about pages, and in 2021 I made
        graphics for it. On my first anniversary, the founders thanked me for my designs on &ldquo;our platform,
        website, and more.&rdquo;
      </p>

      <Website />

      <h2 id="working-with-engineering" className={styles.subhead}>
        With engineering
      </h2>

      <blockquote className={`${styles.body} ${work.quote}`}>
        <p>
          &ldquo;&hellip;for bringing the &lsquo;building contracts&rsquo; designs to the tech team early and often, and
          iterating to get to a model that&apos;s clear and simple and feasible.&rdquo;
        </p>
        <footer>Al Huizenga, Director of Product Management</footer>
      </blockquote>

      <blockquote className={`${styles.body} ${work.quote}`}>
        <p>&ldquo;&hellip;its been great getting to know you guys and the flow between design and dev at Wethos!&rdquo;</p>
        <footer>Craig Walker, Front-End Developer</footer>
      </blockquote>

      <h2 id="what-i-learned" className={styles.subhead}>
        What I learned
      </h2>

      <p className={styles.body}>
        I learned as much about running a business as about design. Talking to customers and building for them, I saw
        how people price a project, break it down, put a proposal together and win work.
      </p>

      <p className={styles.body}>
        Watching so many people build their own agencies on Wethos is what showed me I could do it myself. After Wethos, in June 2022, I started{" "}
        <a href="https://studiosupernice.com" target="_blank" rel="noopener noreferrer">
          SuperNice
        </a>
        .
      </p>


      <MoreWork slug="wethos" />
    </NoteLayout>
  );
}
