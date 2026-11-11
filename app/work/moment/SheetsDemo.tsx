"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./moment.module.css";

/** The bottom sheet from the Moment App components page in Figma, exported at 2x and set on the
 *  app's black. Each is 600 wide; they sit on the stage's floor, as a sheet rises from a phone's. */
const SHEETS = [
  { key: "actions", label: "Actions", height: 499, caption: "Actions on a member: block, remove from a group, or make an admin." },
  { key: "sort", label: "Sort", height: 479, caption: "Sorting a board by hot, latest or top." },
  { key: "report", label: "Report", height: 790, caption: "Reporting a post, with each reason on its own line." },
  { key: "react", label: "React", height: 410, caption: "Long-pressing a chat message to react, reply or report it." },
  { key: "welcome", label: "Welcome", height: 567, caption: "Welcoming a fan to a World, signed by its creators." },
];

export function SheetsDemo() {
  const [active, setActive] = useState(SHEETS[0].key);
  const current = SHEETS.find((s) => s.key === active) ?? SHEETS[0];

  return (
    <figure className={demo.demo}>
      <div className={styles.sheetStage}>
        {SHEETS.map((s) => (
          // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
          <img
            key={s.key}
            src={`/work/moment/sheet-${s.key}.webp`}
            alt={s.key === active ? `The ${s.label} sheet` : ""}
            width={600}
            height={s.height}
            loading="lazy"
            className={styles.sheet}
            data-active={s.key === active || undefined}
          />
        ))}
      </div>

      <div className={demo.toggle} role="group" aria-label="Sheets">
        {SHEETS.map((s) => (
          <button key={s.key} type="button" aria-pressed={s.key === active} onClick={() => setActive(s.key)}>
            {s.label}
          </button>
        ))}
      </div>

      <figcaption className={demo.caption} aria-live="polite">
        {current.caption}
      </figcaption>
    </figure>
  );
}
