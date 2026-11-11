"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./timeline.module.css";

/**
 * May to July 2025, from his email with Shruti and Jon (studio inbox), his 9 May Supercut walkthrough, his
 * Looms of 19 and 30 May, and the [Sidecar] Outline file marked done in July 2025. Founders' notes are
 * paraphrased, never quoted.
 */
type Kind = "me" | "them";

const EVENTS: { date: string; kind: Kind; title: string; text: string }[] = [
  {
    date: "1 May",
    kind: "me",
    title: "Design audit",
    text: "I audited the live add-in before changing anything.",
  },
  {
    date: "9 May",
    kind: "me",
    title: "First draft, as a 30-minute walkthrough",
    text: "The interface rebuilt in Figma, the object map, the tools I compared, and the new structure.",
  },
  {
    date: "11 May",
    kind: "them",
    title: "Shruti's notes",
    text: "Make the outline look more like Word's, and change less, since lawyers resist change.",
  },
  {
    date: "13 May",
    kind: "them",
    title: "Attorney interviews",
    text: "Shruti and Jon shared their interviews with attorneys for me to work from.",
  },
  {
    date: "19 May",
    kind: "me",
    title: "Second walkthrough",
    text: "The nested outline, the welcome screen, and creating a case from its files.",
  },
  {
    date: "20 May",
    kind: "them",
    title: "An attorney's feedback",
    text: "Long citations became smaller improvements, with a view of all the sources.",
  },
  {
    date: "30 May",
    kind: "me",
    title: "Reviewing improvements",
    text: "One step for each improvement, and the case against grouping them.",
  },
  {
    date: "June",
    kind: "them",
    title: "Brand",
    text: "E&W Design Studio made Sidecar's brand. I asked whether the product would get its own palette.",
  },
  {
    date: "July",
    kind: "me",
    title: "Outline done",
    text: "The outline marked done in Figma.",
  },
];

export function Timeline() {
  const [open, setOpen] = useState(1);

  return (
    <figure className={demo.demo}>
      <ol className={styles.line}>
        {EVENTS.map((e, i) => (
          <li key={e.date + e.title} data-kind={e.kind}>
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(i)}>
              <span className={styles.date}>{e.date}</span>
              <span className={styles.title}>{e.title}</span>
            </button>
            {open === i && <p className={styles.text}>{e.text}</p>}
          </li>
        ))}
      </ol>
      <div className={styles.legend} aria-hidden="true">
        <span data-kind="me">From me</span>
        <span data-kind="them">From Sidecar</span>
      </div>
      <figcaption className={demo.caption}>May to July 2025. Tap a step to read it.</figcaption>
    </figure>
  );
}
