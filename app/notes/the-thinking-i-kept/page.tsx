import type { Metadata } from "next";
import styles from "../../page.module.css";
import { NoteHeader } from "../NoteHeader";
import { NoteLayout } from "../NoteLayout";
import { EyeFromRules } from "../demos/EyeFromRules";
import { GameWindow } from "../demos/GameWindow";
import { WhoMadeWhat } from "../demos/WhoMadeWhat";

export const metadata: Metadata = {
  title: "The thinking I kept · Kelvin Man",
  description: "On making The Last Apostate, a game about how much of your thinking you've handed over.",
};

/** Opens in a new tab, for links that leave the site. */
function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Note() {
  return (
    <NoteLayout>
        <NoteHeader slug="the-thinking-i-kept" />

        <p className={styles.body}>
          The Last Apostate started at a Friends of Figma workshop in Los Angeles, with Jon, Danny and Vic. We prototyped it in
          Figma Make: a cathedral, an AI god, and one person who won&apos;t kneel.
        </p>

        <p className={styles.body}>
          After the workshop I kept going. Partly because I&apos;d never made a game with AI, and once we started it was
          really fun. Partly because once I can see the gaps in something, I want to finish it.
        </p>

        <GameWindow />

        <p className={styles.body}>
          I directed it, and Claude wrote most of the code. It also wrote most of the words you read in the game, and some
          of the art. That wasn&apos;t a principle. I don&apos;t know much about game writing or pixel art, and I
          didn&apos;t want to spend the months it would take to learn, so I handed those over.
        </p>

        <WhoMadeWhat />

        <p className={styles.body}>
          Even the pixel art is code. The Eye of the Logos isn&apos;t a drawing; it&apos;s a rule for where each pixel
          goes, so the same rule draws it at any size.
        </p>

        <EyeFromRules />

        <p className={styles.body}>
          That&apos;s the part I keep thinking about. I don&apos;t want to hand my thinking to AI. But there are things
          I&apos;m happy not to think about, and I know that&apos;s a shortcut, and shortcuts cost something eventually. I
          just don&apos;t know yet what this one costs.
        </p>

        <p className={styles.body}>
          What I did learn is that it doesn&apos;t make the decisions I care about on its own. Every improvement came from
          noticing something was off and saying so. Left alone, it would have made a fine game that wasn&apos;t mine.
        </p>

        <p className={styles.body}>
          The Logos, the AI god in the game, isn&apos;t really a villain to me. It was built to mirror the people who made
          it, the way we were made in the image of a god and strayed. It&apos;s made of our own data. When its congregation
          follows it, they&apos;re following a reflection of themselves.
        </p>

        <p className={styles.body}>
          And I don&apos;t feel like I&apos;m thinking less since I started building this way. I&apos;m thinking about
          different things. Whether that&apos;s a fair trade is the question the game asks. I don&apos;t have the answer,
          and I&apos;m not sure I want one.
        </p>

        <p className={styles.body}>
          <Out href="https://kelvinman.github.io/the-last-apostate/">Play The Last Apostate</Out> ·{" "}
          <Out href="https://github.com/kelvinman/the-last-apostate">Read the source</Out>
        </p>
    </NoteLayout>
  );
}
