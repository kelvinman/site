import type { Metadata } from "next";
import styles from "../../page.module.css";
import { NoteLayout } from "../../notes/NoteLayout";
import { MoreWork } from "../MoreWork";
import { Clip } from "../decorx/Clip";
import draft from "../decorx/decorx.module.css";
import demos from "../decorx/demos.module.css";
import work from "../work.module.css";
import { Scattered } from "./Scattered";
import { LabelVariants } from "./LabelVariants";
import { ShippedPhones } from "./ShippedPhones";
import { WorldsDemo } from "./WorldsDemo";
import { PhoneScreens, type PhoneScreen } from "./PhoneScreens";
import { MembershipFlow } from "./MembershipFlow";
import { AppStoreListing } from "./AppStoreListing";
import { SheetOverWorld, SheetsRow, SheetAnatomy, SheetLightDark } from "./DesignSystemOptions";

// From the Moment design files in Figma, my archive of Moment screenshots and
// recordings, the framing of Moment's investor deck (none of its company numbers) and my answers of
// 27 Oct 2026. Behind the case study password; kept out of search.
// Added 11 Nov 2026: phone captures from Jessii Vee World (24 to 29 Mar 2023) from the archive; the
// membership flow from the Membership file in Figma (V13, May 2023); Arjun's line from Slack (about
// 6 Mar 2023); the App Store screenshots, Smart App Banner and bottom sheets exported from the
// Figma files App Assets and Moment App; Apple's approval email for Worlds (20 Mar 2023, Pacific).

/** Following, notifications and their settings, captured on an iPhone in March 2023. */
const SOCIAL: PhoneScreen[] = [
  {
    key: "following",
    label: "Following",
    src: "/work/moment/social-following.webp",
    height: 1106,
    alt: "People: the accounts a fan follows, the creators with verified badges",
    caption: "People: everyone a fan follows, with the creators' verified badges.",
  },
  {
    key: "notifications",
    label: "Notifications",
    src: "/work/moment/social-notifications.webp",
    height: 1106,
    alt: "Notifications: new followers with Follow buttons, and the creators' appearances",
    caption: "Notifications: new followers, with a button to follow back, and the creators' appearances.",
  },
  {
    key: "profile",
    label: "Profile",
    src: "/work/moment/social-profile.webp",
    height: 1106,
    alt: "A profile: an avatar in its outfit, a Following button, and follower counts",
    caption: "A profile: the avatar in its outfit, with a Following button.",
  },
  {
    key: "settings",
    label: "Settings",
    src: "/work/moment/social-settings.webp",
    height: 1106,
    alt: "Notification settings: switches for follows, party invites and chat messages",
    caption: "Settings: follows, party invites and chat messages, each on its own switch.",
  },
];

/** The Smart App Banner design in its light and dark versions. */
const BANNER: PhoneScreen[] = [
  {
    key: "light",
    label: "Light",
    src: "/work/moment/banner-light.webp",
    height: 1104,
    tone: "light",
    alt: "A World's page in Safari, light, with an Open in the Worlds app banner and a Get the Worlds app sheet",
    caption: "Light mode, with Apple's system blue.",
  },
  {
    key: "dark",
    label: "Dark",
    src: "/work/moment/banner-dark.webp",
    height: 1104,
    alt: "The same page and sheet in dark mode",
    caption: "Dark mode, where the same blue turns brighter.",
  },
];
export const metadata: Metadata = {
  title: "Moment · Kelvin Man",
  description: "Designing Worlds, a space for each creator's community.",
  robots: { index: false, follow: false },
  // The card sits outside /work/moment, so link previews can load it without the password.
  openGraph: { title: "Moment · Kelvin Man", url: "/work/moment", siteName: "Kelvin Man", type: "article", images: "/og/work-moment.png" },
  twitter: { card: "summary_large_image", images: "/og/work-moment.png" },
};

const SECTIONS = [
  { id: "the-problem", title: "The problem" },
  { id: "one-place", title: "One place" },
  { id: "friends", title: "Friends and parties" },
  { id: "membership", title: "Membership" },
  { id: "hard-parts", title: "The hard parts" },
  { id: "design-system", title: "The design system" },
  { id: "launch", title: "Launch night" },
  { id: "app-store", title: "On the App Store" },
  { id: "what-i-learned", title: "What I learned" },
  { id: "more-work", title: "More work" },
];


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
      <header className={styles.header}>
        <h1 className={styles.name}>Moment</h1>
        <p className={styles.meta}>Senior product designer, 2022 to 2023</p>
      </header>

      <p className={styles.dash} aria-hidden="true">
        —
      </p>

      <p className={styles.body}>
        I designed Worlds for web and mobile. Each creator got a space for their community, with chat, a board, a 3D
        world, live events and a shop.{" "}
        <a href="https://news.patreon.com/articles/patreon-acquires-moment" target="_blank" rel="noopener noreferrer">
          Patreon acquired Moment
        </a>{" "}
        in October 2023.
      </p>

      <p className={styles.body}>
        Moment hired me to refine its beta, organize its design system, and design the mobile launch, social features
        like following and parties, and events inside each World, like a creator appearing live or a merch drop.
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

      <h2 id="friends" className={styles.subhead}>
        Friends and parties
      </h2>

      <p className={styles.body}>
        Fans followed each other and the creator. Notifications told them who followed them, when the creator made an
        appearance, and when a friend invited them to a party. Fans chose which of these reached their phone. Tap
        through it:
      </p>

      <PhoneScreens screens={SOCIAL} label="Screens" note="Captured on an iPhone in Jessii Vee World, March 2023." />

      <h2 id="membership" className={styles.subhead}>
        Membership
      </h2>

      <p className={styles.body}>
        Creators needed a way to earn from their World. Giel and I designed memberships, where paying fans got into
        members-only events, merch and chats.
      </p>

      <p className={styles.body}>
        A fan who hadn&apos;t joined saw a members-only channel behind a lock, and could join from there. Tap through
        the flow:
      </p>

      <MembershipFlow />

      <blockquote className={`${styles.body} ${work.quote}`}>
        <p>
          &ldquo;Nice work on the membership design&hellip; people are super excited about it both externally and
          internally.&rdquo;
        </p>
        <footer>Arjun Mehta, co-founder of Moment, in Slack, March 2023</footer>
      </blockquote>

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

      <h2 id="design-system" className={styles.subhead}>
        The design system
      </h2>

      <p className={styles.body}>
        In the design system, colors came in light and dark pairs. Patterns that repeated became shared
        components, like the bottom sheet, which had a version for each job:
      </p>

      {/* Four ways to present the sheets, for Kelvin to choose one; the other three come out after. */}
      <p className={styles.label}>Option 1: over a World</p>
      <SheetOverWorld />
      <p className={styles.label}>Option 2: side by side</p>
      <SheetsRow />
      <p className={styles.label}>Option 3: anatomy</p>
      <SheetAnatomy />
      <p className={styles.label}>Option 4: light and dark</p>
      <SheetLightDark />

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

      <blockquote className={`${styles.body} ${work.quote}`}>
        <p>&ldquo;I think it&apos;s amazing that I can meet one of my favorite YouTubers in a game that they made.&rdquo;</p>
        <footer>A fan, March 2023</footer>
      </blockquote>

      <blockquote className={`${styles.body} ${work.quote}`}>
        <p>&ldquo;He understood our business needs&hellip; He was able to work efficiently in a fast-paced environment.&rdquo;</p>
        <footer>Arjun Mehta, co-founder of Moment</footer>
      </blockquote>

      <blockquote className={`${styles.body} ${work.quote}`}>
        <p>&ldquo;I really enjoyed working with you&hellip; you drove a lot of value. Loved to see it.&rdquo;</p>
        <footer>Nigel Egrari, co-founder of Moment</footer>
      </blockquote>

      <p className={styles.label}>Built with</p>

      <dl className={demos.credits}>
        <dt>Giel</dt>
        <dd>design</dd>
        <dt>Jean</dt>
        <dd>engineering</dd>
        <dt>Clayton</dt>
        <dd>head of product, on the founding team</dd>
        <dt>Arjun</dt>
        <dd>CEO</dd>
      </dl>

      <h2 id="app-store" className={styles.subhead}>
        On the App Store
      </h2>

      <p className={styles.body}>
        Apple approved the Worlds app for the App Store in March 2023. It brought each World&apos;s Board, Chats and
        Space to the iPhone.
      </p>

      <AppStoreListing />

      <p className={styles.body}>
        On a phone&apos;s browser, a banner and a sheet pointed fans to the app:
      </p>

      <PhoneScreens
        screens={BANNER}
        label="Appearance"
        note="The member and online counts were placeholders, blurred here."
      />


      <h2 id="what-i-learned" className={styles.subhead}>
        What I learned
      </h2>

      <p className={styles.body}>
        When nothing like it exists yet, a mockup only gets you so far. I learned to get ideas into the real thing
        early, since the labels only came right once we saw them in the 3D world.
      </p>

      <p className={styles.body}>
        Working next to Giel taught me restraint: knowing what to leave out so the rest can look great. I still design
        that way. Thank you,{" "}
        <a href="https://gielcobben.com/" target="_blank" rel="noopener noreferrer">
          Giel
        </a>
        .
      </p>


      <MoreWork slug="moment" />
    </NoteLayout>
  );
}
