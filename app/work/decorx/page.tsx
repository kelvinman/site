import type { Metadata } from "next";
import styles from "../../page.module.css";
import { NoteLayout } from "../../notes/NoteLayout";
import { Clip } from "./Clip";
import draft from "./decorx.module.css";
import { FabricMapper } from "./FabricMapper";
import { FairQueue } from "./FairQueue";
import { ShowroomPhone } from "./ShowroomPhone";
import { TwoProducts } from "./TwoProducts";
import { Workflow } from "./Workflow";
import demos from "./demos.module.css";

// A local draft built from "DecorX Case Study - Draft.md" in KelvinOS, the High Point deck and
// its recordings, with my answers of 26 Oct 2026 worked in. The prose is still a model's draft,
// not mine yet. Mark has agreed to naming DecorX, its customers and usage numbers. Kept out of
// search until it's published.
export const metadata: Metadata = {
  title: "DecorX · Kelvin Man",
  description:
    "Designing and building an AI imagery platform for furniture brands.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { id: "the-problem", title: "The problem" },
  { id: "starting-over", title: "Two products, then one" },
  { id: "designer", title: "Designer" },
  { id: "scenes", title: "Scenes at scale" },
  { id: "fabric", title: "Any fabric, any part" },
  { id: "the-market", title: "The market" },
  { id: "taking-turns", title: "Taking turns" },
  { id: "showroom-app", title: "The showroom app" },
  { id: "how-i-worked", title: "How I worked" },
  { id: "what-i-learned", title: "What I learned" },
];

/** Something only Kelvin can fill in or decide. */
function Gap({ children }: { children: React.ReactNode }) {
  return <span className={draft.gap}>{children}</span>;
}

/** A still, from the deck or the changelog. */
function Figure({
  src,
  caption,
  height = 900,
}: {
  src: string;
  caption: string;
  height?: number;
}) {
  return (
    <figure className={draft.figure}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
      <img
        src={`/work/decorx/${src}`}
        alt={caption}
        width={1600}
        height={height}
        loading="lazy"
      />
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

export default function DecorX() {
  return (
    <NoteLayout sections={SECTIONS} back={{ href: "/work", label: "Work" }}>
      <p className={draft.draft}>
        Local draft. The prose is a model&apos;s draft, not my words yet. Orange
        marks are what&apos;s left to decide.
      </p>

      <header className={styles.header}>
        <h1 className={styles.name}>DecorX</h1>
        <p className={styles.meta}>Founding design engineer, 2024 to now</p>
      </header>

      <p className={styles.dash} aria-hidden="true">
        —
      </p>

      <p className={styles.body}>
        An AI imagery platform for furniture brands. I built the platform it
        runs on, from an empty repo to the product Wayfair, Nebraska Furniture
        Mart and Kathy Kuo Home use, in 9 months.
      </p>

      <Clip
        name="showroom-loop"
        caption="The loop on the showroom TVs at High Point Market, October 2026."
      />

      <Numbers
        items={[
          ["9 months", "from empty repo"],
          ["70%", "of 1,600 commits"],
          ["438", "projects in a week"],
        ]}
      />

      <h2 id="the-problem" className={styles.subhead}>
        The problem
      </h2>

      <p className={styles.body}>
        Furniture brands need images of every product, in every fabric, in rooms
        that look like their brand. General AI tools don&apos;t know the catalog
        or the brand.
      </p>

      <p className={styles.body}>
        DecorX starts from a style kit: a brand&apos;s look, captured from a few
        reference images.
      </p>

      <Clip
        name="style-kits-clip"
        ratio="1280 / 748"
        caption="A style kit generated from five reference images."
      />

      <Figure
        src="kk-home-style-kit.jpg"
        caption="Kathy Kuo Home's catalog pages, original above and regenerated with their style kit below."
      />

      <h2 id="starting-over" className={styles.subhead}>
        Two products, then one
      </h2>

      <p className={styles.body}>
        DecorX began as two products: Canvas, built by our team in China from my
        designs, and Portal, a prototype I started in January 2026.
      </p>

      <TwoProducts />

      <p className={styles.body}>
        Customers wanted both, and two links confused them. Rather than merge
        two builds, we moved everyone onto Portal, and the same team builds on
        it now.
      </p>

      <h2 id="designer" className={styles.subhead}>
        Designer
      </h2>

      <p className={styles.body}>
        The centre of the product: a board where designers connect products,
        sketches and prompts, then edit the results with AI.
      </p>

      <Figure
        src="designer-canvas.jpg"
        caption="Designer: a sketch in, product renders and room scenes out."
        height={1036}
      />

      <Gap>
        <strong>To do:</strong> swap this still for a screen recording of a real
        Designer session.
      </Gap>

      <h2 id="scenes" className={styles.subhead}>
        Scenes at scale
      </h2>

      <p className={styles.body}>
        Scene Generator groups a whole collection into rooms and generates each
        one in the brand&apos;s style.
      </p>

      <Clip
        name="scene-generator-clip"
        ratio="1280 / 686"
        caption="Products in, grouped into rooms, generated, then a close-up of one bed."
      />

      <p className={styles.body}>
        For work that has to be right first time, an agent reviews each image
        and only the best comes back. It costs four times the credits, so
        it&apos;s off by default.
      </p>

      <h2 id="fabric" className={styles.subhead}>
        Any fabric, any part
      </h2>

      <p className={styles.body}>
        Fabric Mapper finds a sofa&apos;s parts, so the seat can take one fabric
        and the pillows another. A real sofa, with its real segments:
      </p>

      <FabricMapper />

      <h2 id="the-market" className={styles.subhead}>
        The market
      </h2>

      <p className={styles.body}>
        At High Point Market, every buyer&apos;s picks became a project with
        their own style kit and room scenes, in about 5 minutes.
      </p>

      <Numbers
        items={[
          ["39", "reps"],
          ["94%", "got a style kit"],
          ["13,800", "picks matched"],
        ]}
      />

      <p className={styles.body}>
        What didn&apos;t land: reps skipped the share page and sent the images
        in their own email threads. Next time I&apos;d build the follow-up
        around that.
      </p>

      <h2 id="taking-turns" className={styles.subhead}>
        Taking turns
      </h2>

      <p className={styles.body}>
        When one brand sends a huge batch, first come, first served makes
        everyone else wait. So the queue takes turns.
      </p>

      <FairQueue />

      <h2 id="showroom-app" className={styles.subhead}>
        The showroom app
      </h2>

      <p className={styles.body}>
        A QR code on the showroom TV opens a chat. Type your store&apos;s name,
        and DecorX finds your rooms online and builds you a style kit and picks.
      </p>

      <ShowroomPhone />

      <h2 id="how-i-worked" className={styles.subhead}>
        How I worked
      </h2>

      <p className={styles.body}>
        Every change, from the team or an agent, ships the same way:
      </p>

      <Workflow />

      <p className={styles.label}>Built with</p>

      <dl className={demos.credits}>
        <dt>Dustin</dt>
        <dd>sign-up, two-factor and emails</dd>
        <dt>Yifei</dt>
        <dd>the generation pipeline</dd>
        <dt>Team in China</dt>
        <dd>the Designer chat and moving the data over</dd>
      </dl>

      <h2 id="what-i-learned" className={styles.subhead}>
        What I learned
      </h2>

      <ul className={styles.bullets}>
        <li>
          <strong>It&apos;s bigger than pixels.</strong> Sales, docs, the changelog, code review and CI all ship the product.
        </li>
        <li>
          <strong>Close the gap between idea and shipping.</strong> Share a real prototype, not a mockup.
        </li>
        <li>
          <strong>Next time, one thing.</strong> One audience, the one thing they&apos;d pay for, done very well.
        </li>
      </ul>

      <p className={styles.body}>
        Want to walk through any of this? <a href="mailto:hello@kelvinman.com">hello@kelvinman.com</a>
      </p>

    </NoteLayout>
  );
}
