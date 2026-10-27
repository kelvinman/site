import type { Metadata } from "next";
import styles from "../../page.module.css";
import { NoteLayout } from "../../notes/NoteLayout";
import { Clip } from "../decorx/Clip";
import draft from "../decorx/decorx.module.css";
import { Scattered } from "./Scattered";
import { LabelVariants } from "./LabelVariants";
import { ShippedPhones } from "./ShippedPhones";
import { WorldsDemo } from "./WorldsDemo";

// A local draft from the Moment design files in Figma, my archive of Moment screenshots and
// recordings, the framing of Moment's investor deck (none of its company numbers) and my answers of
// 27 Oct 2026. Behind the case study password; kept out of search.
export const metadata: Metadata = {
  title: "Moment · Kelvin Man",
  description: "Designing Worlds, a home for creators' communities.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  { id: "the-problem", title: "The problem" },
  { id: "one-place", title: "One place" },
  { id: "hard-parts", title: "The hard parts" },
  { id: "launch", title: "Launch night" },
  { id: "what-i-learned", title: "What I learned" },
];

/** Something only Kelvin can fill in or decide. */
function Gap({ children }: { children: React.ReactNode }) {
  return <span className={draft.gap}>{children}</span>;
}

/** A still from the design files or an archived screenshot. */
function Figure({ src, caption, width, height }: { src: string; caption: string; width: number; height: number }) {
  return (
    <figure className={draft.figure}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
      <img src={`/work/moment/${src}`} alt={caption} width={width} height={height} loading="lazy" />
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

export default function Moment() {
  return (
    <NoteLayout sections={SECTIONS} back={{ href: "/work", label: "Work" }}>
      <p className={draft.draft}>
        Local draft. The prose is a model&apos;s draft, not my words yet. Orange marks are what&apos;s left to decide.
      </p>

      <header className={styles.header}>
        <h1 className={styles.name}>Moment</h1>
        <p className={styles.meta}>Senior product designer, 2022 to 2023</p>
      </header>

      <p className={styles.dash} aria-hidden="true">
        —
      </p>

      <p className={styles.body}>
        Worlds gave each creator a home for their community: chat, a board, a 3D space, live events and a shop, in one
        place on web and mobile. I designed its apps.
      </p>

      <Figure src="app-screens.webp" caption="Murder With My Husband World on iOS: home, board, chats, the 3D space, people." width={1600} height={617} />

      <Numbers
        items={[
          ["10 months", "August to May"],
          ["5", "creator worlds live"],
          ["Oct 2023", "acquired by Patreon"],
        ]}
      />

      <h2 id="the-problem" className={styles.subhead}>
        The problem
      </h2>

      <p className={styles.body}>
        A creator&apos;s community lived in four places, none of them the creator&apos;s, and most paid the creator
        nothing.
      </p>

      <Scattered />

      <h2 id="one-place" className={styles.subhead}>
        One place
      </h2>

      <p className={styles.body}>
        Membership, a 3D world, shops, a board and live events all shared one platform. Every part had to feel like the
        same place, with one identity across them. Tap around it:
      </p>

      <WorldsDemo />

      <h2 id="hard-parts" className={styles.subhead}>
        The hard parts
      </h2>

      <p className={styles.body}>
        <strong>A 3D world on a phone.</strong> Moving around, chatting and talking out loud all had to fit one small
        screen, with the joystick, the chat bar and the sound controls sharing it with the world itself.
      </p>

      <ShippedPhones />

      <p className={styles.body}>
        <strong>Fans and creators in the same place.</strong> Creators went live from the same platform their fans used,
        so they needed controls fans didn&apos;t have, like appearing live to everyone in their World at once.
      </p>

      <Figure src="live-appearance.jpg" caption="A creator's control in Paris World: Live Appearance, with its mic." width={1200} height={374} />

      <p className={styles.body}>
        <strong>2D on top of 3D.</strong> Names, chat bubbles and labels float over the world, closer to AR than to a
        normal app. We prototyped them in 2D, then had to work out how they size with distance, stay readable over
        any scene, and let the world show through.
      </p>

      <Figure
        src="label-frame.jpg"
        caption="From my Figma file for in-world labels: a place label mocked up over Andrew Schulz's World, with chat on both sides."
        width={1400}
        height={906}
      />

      <LabelVariants />

      <Figure
        src="name-tags.jpg"
        caption="Name tags and a chat bubble over avatars. The creator's verified tag stands out from the fans'."
        width={1400}
        height={898}
      />

      <p className={styles.body}>
        I drew the verified badges for Moment, then shared them as{" "}
        <a href="https://www.figma.com/community/file/1157094402778889516/verified-icons">Verified Icons</a> on Figma
        Community, where 18.1k people have used them.
      </p>

      <h2 id="launch" className={styles.subhead}>
        Launch night
      </h2>

      <p className={styles.body}>
        Paris World opened in November 2022 with a live stage, a treasure hunt and wearables to find, and crowds of fans
        around Paris&apos;s own avatar.
      </p>

      <Figure src="paris-stage.jpg" caption="The live stage in Paris World, November 2022." width={1400} height={796} />
      <Figure src="paris-reward.jpg" caption="Finding a wearable in the treasure hunt." width={1400} height={768} />
      <Figure src="paris-crowd.jpg" caption="Fans around Paris's avatar on launch night." width={1400} height={812} />

      <Clip
        dir="moment"
        name="world-live"
        ratio="1280 / 820"
        caption="Fans inside Murder With My Husband World, chatting as they walk around."
      />

      <p className={styles.body}>
        &ldquo;I think it&apos;s amazing that I can meet one of my favorite YouTubers in a game that they made.&rdquo; A fan,
        March 2023. Patreon acquired Moment in October 2023.
      </p>

      <p className={styles.body}>Built with Giel, another designer; Arjun Mehta, the CEO; Clayton Barnes; and an engineer.</p>

      <p className={styles.body}>
        &ldquo;He understood our business needs&hellip; He was able to work efficiently in a fast-paced environment.&rdquo;
        Arjun Mehta, CEO of Moment.
      </p>

      <Gap>
        <strong>Fill in:</strong> Clayton&apos;s role (he interviewed you with Arjun in August 2022, but isn&apos;t a
        designer) and the engineer&apos;s name.
      </Gap>

      <h2 id="what-i-learned" className={styles.subhead}>
        What I learned
      </h2>

      <Gap>
        <strong>Your words:</strong> one or two lines. Even rough is fine.
      </Gap>

      <p className={styles.body}>
        Want to walk through any of this? <a href="mailto:hello@kelvinman.com">hello@kelvinman.com</a>
      </p>
    </NoteLayout>
  );
}
