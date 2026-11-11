"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./moment.module.css";
import { StatusIcons } from "./ShippedPhones";

/** Four ways to show the bottom sheet from the Moment App components page, for Kelvin to pick one.
 *  Every sheet is the real export at 2x, 600 wide. */
const SHEETS = [
  { key: "actions", label: "Actions", height: 499, caption: "Actions on a member: block, remove from a group, or make an admin." },
  { key: "sort", label: "Sort", height: 479, caption: "Sorting a board by hot, latest or top." },
  { key: "report", label: "Report", height: 790, caption: "Reporting a post, with each reason on its own line." },
  { key: "react", label: "React", height: 410, caption: "Long-pressing a chat message to react, reply or report it." },
  { key: "welcome", label: "Welcome", height: 567, caption: "Welcoming a fan to a World, signed by its creators." },
];

function Toggle({ value, onChange, items }: { value: string; onChange: (k: string) => void; items: { key: string; label: string }[] }) {
  return (
    <div className={demo.toggle} role="group" aria-label="Sheets">
      {items.map((s) => (
        <button key={s.key} type="button" aria-pressed={s.key === value} onClick={() => onChange(s.key)}>
          {s.label}
        </button>
      ))}
    </div>
  );
}

/** Option 1: the sheet rising over a World's board on the phone, the page dimmed behind it. */
export function SheetOverWorld() {
  const [active, setActive] = useState("sort");
  const current = SHEETS.find((s) => s.key === active) ?? SHEETS[0];

  return (
    <figure className={demo.demo}>
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
      </div>
      <Toggle value={active} onChange={setActive} items={SHEETS} />
      <figcaption className={demo.caption} aria-live="polite">
        {current.caption}
      </figcaption>
    </figure>
  );
}

/** Option 2: every sheet at once, bottoms lined up, the way they sit on the Figma page. */
export function SheetsRow() {
  return (
    <figure className={demo.demo}>
      <div className={styles.sheetRow}>
        {SHEETS.map((s) => (
          <div key={s.key} className={styles.sheetCell}>
            <div className={styles.sheetTile}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
              <img src={`/work/moment/sheet-${s.key}.webp`} alt={`The ${s.label} sheet`} width={600} height={s.height} loading="lazy" />
            </div>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
      <figcaption className={demo.caption}>
        Five versions of one bottom sheet. Each shares the handle, the corner, the padding and the home bar.
      </figcaption>
    </figure>
  );
}

/** Where each shared part sits, in percent down the sheet's image, for the two sheets the anatomy
 *  switches between. Measured on the 600-wide exports. */
const PARTS: Record<string, { name: string; y: number }[]> = {
  report: [
    { name: "Handle", y: 11.4 },
    { name: "Title", y: 16.2 },
    { name: "Divider", y: 20.5 },
    { name: "Options", y: 51 },
    { name: "Buttons", y: 84.8 },
    { name: "Home bar", y: 94.9 },
  ],
  sort: [
    { name: "Handle", y: 18.6 },
    { name: "Title", y: 26.5 },
    { name: "Divider", y: 33.6 },
    { name: "Options", y: 57 },
    { name: "Home bar", y: 91.6 },
  ],
};

/** Option 3: one sheet with its shared parts named; the toggle swaps the sheet, the names follow. */
export function SheetAnatomy() {
  const [active, setActive] = useState("report");
  const items = SHEETS.filter((s) => s.key in PARTS);
  const current = items.find((s) => s.key === active) ?? items[0];

  return (
    <figure className={demo.demo}>
      <div className={styles.anatomySheet} style={{ aspectRatio: `600 / ${current.height}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
        <img src={`/work/moment/sheet-${current.key}.webp`} alt={`The ${current.label} sheet, its parts named`} width={600} height={current.height} />
        {PARTS[current.key].map((p) => (
          <span key={p.name} className={styles.part} style={{ top: `${p.y}%` }}>
            {p.name}
          </span>
        ))}
      </div>
      <Toggle value={active} onChange={setActive} items={items} />
      <figcaption className={demo.caption} aria-live="polite">
        The parts every sheet shares, named on the {current.label} sheet. Only what sits between the divider and the
        home bar changes.
      </figcaption>
    </figure>
  );
}

/** Option 4: the same sheet in light and dark, with the color pairs that switch between them. */
const PAIRS = [
  { name: "Label", light: "#000000", dark: "#FFFFFF" },
  { name: "System blue", light: "#007AFF", dark: "#0A84FF" },
];

export function SheetLightDark() {
  return (
    <figure className={demo.demo}>
      <div className={styles.pair}>
        {(["light", "dark"] as const).map((mode) => (
          <div key={mode} className={styles.pairSide}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
            <img src={`/work/moment/ds-sheet-${mode}.webp`} alt={`The Get the Worlds app sheet, ${mode}`} width={600} height={345} loading="lazy" />
            <span>{mode === "light" ? "Light" : "Dark"}</span>
          </div>
        ))}
      </div>
      <dl className={styles.swatches}>
        {PAIRS.map((p) => (
          <div key={p.name}>
            <dt>{p.name}</dt>
            <dd>
              <i style={{ background: p.light }} /> {p.light}
            </dd>
            <dd>
              <i style={{ background: p.dark }} /> {p.dark}
            </dd>
          </div>
        ))}
      </dl>
      <figcaption className={demo.caption}>
        The sheet that sent phone browsers to the app, in light and dark. The color names and values are the
        design system&apos;s own.
      </figcaption>
    </figure>
  );
}
