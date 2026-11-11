"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./moment.module.css";
import { StatusIcons } from "./ShippedPhones";

/**
 * The bottom sheet from the Moment App components page in Figma, rising over Jessii Vee World's
 * board on the phone, with the parts every version shares named beside it. Each sheet is the real
 * export at 2x, 600 wide, with its shadow; `parts` are where each part sits, in percent down that
 * image, measured on the exports. Kelvin chose this from four ways of showing the sheets (11 Nov
 * 2026): over a World, with the anatomy's names.
 */
type Part = { name: string; y: number };

const SHEETS: { key: string; label: string; height: number; caption: string; parts: Part[] }[] = [
  {
    key: "sort",
    label: "Sort",
    height: 479,
    caption: "Sorting a board by hot, latest or top.",
    parts: [
      { name: "Handle", y: 18.6 },
      { name: "Title", y: 26.5 },
      { name: "Divider", y: 33.6 },
      { name: "Options", y: 57.2 },
      { name: "Home bar", y: 91.6 },
    ],
  },
  {
    key: "actions",
    label: "Actions",
    height: 499,
    caption: "Actions on a member: block, remove from a group, or make an admin.",
    parts: [
      { name: "Handle", y: 18 },
      { name: "Buttons", y: 44.1 },
      { name: "Divider", y: 69.7 },
      { name: "Home bar", y: 92.2 },
    ],
  },
  {
    key: "report",
    label: "Report",
    height: 790,
    caption: "Reporting a post, with each reason on its own line.",
    parts: [
      { name: "Handle", y: 11.4 },
      { name: "Title", y: 16.2 },
      { name: "Divider", y: 20.5 },
      { name: "Options", y: 51 },
      { name: "Buttons", y: 84.8 },
      { name: "Home bar", y: 94.9 },
    ],
  },
  {
    key: "react",
    label: "React",
    height: 410,
    caption: "Long-pressing a chat message to react, reply or report it.",
    parts: [
      { name: "Handle", y: 22 },
      { name: "Reactions", y: 35.6 },
      { name: "Divider", y: 48.3 },
      { name: "Options", y: 68.3 },
      { name: "Home bar", y: 90.5 },
    ],
  },
  {
    key: "welcome",
    label: "Welcome",
    height: 567,
    caption: "Welcoming a fan to a World, signed by its creators. The one sheet without a handle.",
    parts: [
      { name: "Title", y: 32.3 },
      { name: "Buttons", y: 68.6 },
      { name: "Home bar", y: 92.9 },
    ],
  },
];

export function SheetsDemo() {
  const [active, setActive] = useState(SHEETS[0].key);
  const current = SHEETS.find((s) => s.key === active) ?? SHEETS[0];

  return (
    <figure className={demo.demo}>
      <div className={styles.namedPhone}>
        <div className={styles.anatomyShot}>
          <div className={styles.glass}>
            <div className={styles.statusBar} aria-hidden="true">
              <span>9:41</span>
              <StatusIcons />
            </div>
            <span className={styles.notch} aria-hidden="true" />
            <div className={styles.shots}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
              <img src="/work/moment/ds-world.webp" alt="" width={540} height={1106} loading="lazy" className={styles.screen} data-active />
              <span className={styles.dim} />
            </div>
            {SHEETS.map((s) => (
              // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
              <img
                key={s.key}
                src={`/work/moment/sheet-${s.key}-a.webp`}
                alt={s.key === active ? `The ${s.label} sheet over Jessii Vee World's board` : ""}
                width={600}
                height={s.height}
                loading="lazy"
                className={styles.riser}
                data-active={s.key === active || undefined}
              />
            ))}
          </div>

          {/* The names sit outside the glass, so they are not clipped; this box takes the glass's
              place and a box inside it the sheet's, so each name lines up with its part. */}
          <div className={styles.glassGuide} aria-hidden="true">
            <div className={styles.riserGuide} style={{ aspectRatio: `600 / ${current.height}` }}>
              {current.parts.map((p) => (
                <span key={`${current.key}-${p.name}`} className={styles.partName} style={{ top: `${p.y}%` }}>
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        </div>
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
