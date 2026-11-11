"use client";

import { useState } from "react";
import styles from "./portal.module.css";

/**
 * Two screens of the 2025 Portal, rebuilt in HTML from his [DecorX] Portal file in Figma and his Portal Loom of
 * 23 May 2025, because the file's export is disabled and the Loom frames are blurry. Layout, labels and colours
 * follow the design; the dates, counts and room photo are stand-ins (the photo is from DecorX's changelog). Both
 * keep the product's own light look in dark mode, and scale with their width like a screenshot would.
 */

const NAV = ["Magic Background", "Background Removal", "Attributes Generation", "Settings"];

function Sidebar({ active }: { active: string }) {
  return (
    <aside className={styles.side}>
      <span className={styles.logo}>decorX</span>
      <ul>
        {NAV.map((n) => (
          <li key={n} data-active={n === active || undefined}>
            <span className={styles.icon} aria-hidden="true" />
            {n}
          </li>
        ))}
      </ul>
    </aside>
  );
}

const IMPORTS: { date: string; count: number; status: "ready" | "running" | "done" }[] = [
  { date: "21 May, 2025", count: 1, status: "ready" },
  { date: "16 May, 2025", count: 1, status: "running" },
  { date: "7 May, 2025", count: 5, status: "done" },
  { date: "24 Apr, 2025", count: 34, status: "done" },
  { date: "10 Apr, 2025", count: 23, status: "done" },
  { date: "2 Apr, 2025", count: 19, status: "done" },
];

const STATUS = { ready: "Ready to generate", running: "Generating attributes", done: "Attributes generated" };

export function AttributesScreen() {
  return (
    <div className={styles.screen} role="img" aria-label="The 2025 Portal's Attributes Generation page: six spreadsheet imports by date, each with its number of products and its status">
      <Sidebar active="Attributes Generation" />
      <main className={styles.main}>
        <div className={styles.head}>
          <div>
            <p className={styles.title}>Attributes Generation</p>
            <p className={styles.sub}>Create attributes from images and descriptions to enhance search, filters, and SEO.</p>
          </div>
          <span className={styles.primary}>Import from CSV</span>
        </div>
        <div className={styles.cards}>
          {IMPORTS.map((i) => (
            <div key={i.date} className={styles.card}>
              <b>{i.date}</b>
              <span>
                {i.count} {i.count === 1 ? "Product" : "Products"}
              </span>
              <em data-status={i.status}>{STATUS[i.status]}</em>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* Stand-in versions: the same photo with a different light, as if each Re-generate changed it. */
const LOOKS = ["none", "sepia(0.25) saturate(1.1)", "brightness(1.06) contrast(0.95)", "saturate(0.8) hue-rotate(-8deg)", "brightness(0.95) sepia(0.15)"];
const TOOLS = ["Background Description", "Resize Product", "Erase"];

export function EditScreen() {
  const [versions, setVersions] = useState(1);
  const [shown, setShown] = useState(0);

  function regenerate() {
    if (versions >= LOOKS.length) return;
    setVersions(versions + 1);
    setShown(versions);
  }

  return (
    <div className={styles.screen} data-edit>
      <main className={styles.edit}>
        <div className={styles.bar}>
          <span className={styles.crumb}>
            Magic Background <i aria-hidden="true">›</i> <b>Untitled</b>
          </span>
        </div>
        <div className={styles.cols}>
          <div className={styles.panel}>
            <p className={styles.panelHead}>History</p>
            <div className={styles.history}>
              {Array.from({ length: versions }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  data-on={i === shown || undefined}
                  onClick={() => setShown(i)}
                  aria-label={`Show version ${i + 1}`}
                  style={{ backgroundImage: "url(/work/decorx/portal-room.webp)", filter: LOOKS[i] }}
                />
              ))}
            </div>
          </div>
          <div className={styles.canvas}>
            <p className={styles.panelHead}>Background generated</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, image is pre-sized */}
            <img src="/work/decorx/portal-room.webp" alt="" width={960} height={960} style={{ filter: LOOKS[shown] }} />
          </div>
          <div className={styles.tools}>
            {TOOLS.map((t) => (
              <span key={t} className={styles.tool}>
                {t}
              </span>
            ))}
            <div className={`${styles.tool} ${styles.open}`}>
              <span>Replace Product</span>
              <span className={styles.label}>Prompt</span>
              <span className={styles.prompt}>Warm afternoon light, a linen runner on the table.</span>
              <span className={styles.label}>Brush Size</span>
              <span className={styles.slider} aria-hidden="true" />
              <button type="button" className={styles.primary} onClick={regenerate} disabled={versions >= LOOKS.length}>
                Re-generate
              </button>
            </div>
            <span className={styles.tool}>Reframe</span>
          </div>
        </div>
      </main>
    </div>
  );
}
