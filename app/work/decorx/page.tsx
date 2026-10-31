import type { Metadata } from "next";
import styles from "../../page.module.css";
import { NoteLayout } from "../../notes/NoteLayout";
import { MoreWork } from "../MoreWork";
import { Clip } from "./Clip";
import draft from "./decorx.module.css";
import { FabricMapper } from "./FabricMapper";
import { FairQueue } from "./FairQueue";
import { ShowroomPhone } from "./ShowroomPhone";
import { TwoProducts } from "./TwoProducts";
import { Workflow } from "./Workflow";
import demos from "./demos.module.css";

// Built from "DecorX Case Study - Draft.md" in KelvinOS, the High Point deck and
// its recordings, with my answers of 26 Oct 2026 worked in. The prose is still a model's draft,
// not mine yet. Mark has agreed to naming DecorX, its customers and usage numbers. Kept out of
// search until it's published.
export const metadata: Metadata = {
  title: "DecorX · Kelvin Man",
  description:
    "Designing and building an AI imagery platform for furniture retailers, manufacturers and interior designers.",
  robots: { index: false, follow: false },
  // The card sits outside /work/decorx, so link previews can load it without the password.
  openGraph: { title: "DecorX · Kelvin Man", url: "/work/decorx", siteName: "Kelvin Man", type: "article", images: "/og/work-decorx.png" },
  twitter: { card: "summary_large_image", images: "/og/work-decorx.png" },
};

const SECTIONS = [
  { id: "the-problem", title: "The problem" },
  { id: "starting-over", title: "Two products, then one" },
  { id: "designer", title: "Designer" },
  { id: "scenes", title: "Scenes at scale" },
  { id: "fabric", title: "Placing the print" },
  { id: "the-market", title: "The market" },
  { id: "taking-turns", title: "Taking turns" },
  { id: "showroom-app", title: "The showroom app" },
  { id: "how-i-worked", title: "How I worked" },
  { id: "what-i-learned", title: "What I learned" },
  { id: "more-work", title: "More work" },
];


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
      <header className={styles.header}>
        <h1 className={styles.name}>DecorX</h1>
        <p className={styles.meta}>Founding design engineer, 2024 to now</p>
      </header>

      <p className={styles.dash} aria-hidden="true">
        —
      </p>

      <p className={styles.body}>
        I designed and built the core of DecorX, an AI imagery platform for furniture retailers, manufacturers and
        interior designers. In 9 months I took it from a prototype to the product Wayfair, Nebraska Furniture Mart and
        Kathy Kuo Home use.
      </p>

      <Clip
        name="showroom-loop"
        caption="The loop on the showroom TVs at High Point Market, October 2026."
      />

      <Numbers
        items={[
          ["9 months", "from prototype to platform"],
          ["70%", "of 1,600 commits"],
          ["438", "projects in a week"],
        ]}
      />

      <h2 id="the-problem" className={styles.subhead}>
        The problem
      </h2>

      <p className={styles.body}>
        Furniture retailers and brands need images of every product, in every
        fabric, in rooms that look like their brand. Photo shoots and 3D
        renders cost hundreds to thousands of dollars for each image. General
        AI tools don&apos;t know the catalog or the brand.
      </p>

      <p className={styles.body}>
        Every DecorX project starts from a style kit, which captures a
        brand&apos;s look from a few reference images.
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
        DecorX began as two products. Our team in China built Canvas, for
        interior designers, from my designs. I started Portal, for retailers, as
        a prototype in January 2026.
      </p>

      <TwoProducts />

      <p className={styles.body}>
        Customers wanted both, and two links confused them. Rather than merge
        two builds, we moved customers onto Portal, and the team in China builds
        on it now.
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
        For work that has to be right first time, you can turn on evaluation. DecorX makes several versions of the
        image, judges them and makes more if none is good enough, and only the best comes back.
      </p>

      <h2 id="fabric" className={styles.subhead}>
        Placing the print
      </h2>

      <p className={styles.body}>
        Fabric Mapper works on any furniture that comes in different fabrics and finishes. You place the swatch on one
        part before anything is generated, and DecorX applies that placement to the rest. Try it on a sofa:
      </p>

      <FabricMapper />

      <h2 id="the-market" className={styles.subhead}>
        The market
      </h2>

      <p className={styles.body}>
        At High Point Market, reps logged each buyer&apos;s picks, and DecorX
        turned them into a project with the buyer&apos;s own style kit and room
        scenes in about 5 minutes.
      </p>

      <Numbers
        items={[
          ["39", "reps"],
          ["94%", "got a style kit"],
          ["13,800", "picks matched"],
        ]}
      />

      <p className={styles.body}>
        One part didn&apos;t work. Reps skipped the share page and sent the images in their own email threads with
        buyers. That thread is where a rep&apos;s relationship with a buyer lives, so the next version should work
        inside it.
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
        Every change ships the same way, whether an engineer or an AI coding
        agent wrote it.
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
          <strong>Design is more than screens.</strong> Sales, docs, the changelog, code review and CI are all part of shipping the product.
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


      <MoreWork slug="decorx" />
    </NoteLayout>
  );
}
