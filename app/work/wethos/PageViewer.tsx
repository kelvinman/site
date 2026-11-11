"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./wethos.module.css";

export type Page = { name: string; src: string; width: number; height: number; caption: string };

/**
 * Pages shown one at a time in a frame of fixed shape, with a toggle under it, so a set can grow
 * without the case study getting longer. Used for the design system and the website.
 */
export function PageViewer({ pages, label }: { pages: Page[]; label: string }) {
  const [active, setActive] = useState(0);
  // Falls back to the first page if the chosen one no longer exists.
  const page = pages[active] ?? pages[0];

  return (
    <figure className={demo.demo}>
      <div className={styles.dsFrame}>
        {pages.map((p, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
          <img
            key={p.name}
            src={p.src}
            alt={p.caption}
            width={p.width}
            height={p.height}
            loading="lazy"
            data-active={i === active || undefined}
          />
        ))}
      </div>

      <div className={demo.toggle} role="group" aria-label={label}>
        {pages.map((p, i) => (
          <button key={p.name} type="button" aria-pressed={active === i} onClick={() => setActive(i)}>
            {p.name}
          </button>
        ))}
      </div>

      <figcaption className={demo.caption} aria-live="polite">
        {page.caption}
      </figcaption>
    </figure>
  );
}
