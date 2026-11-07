"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./wethos.module.css";

/**
 * Pages from the Wethos design system I led, one at a time in a fixed frame, with a toggle under it,
 * so the set can grow without the case study getting longer. Color and Type are from the Foundations
 * file; Buttons and Cards from the Components file, laid out for this page from their
 * Figma components (6 Nov 2026). The illustrations were a licensed pack, so they are left out.
 */
const PAGES = [
  {
    name: "Color",
    src: "/work/wethos/foundations-color.webp",
    width: 1600,
    height: 812,
    caption: "Color: a scale for each hue, from Gray to Skin Tone.",
  },
  {
    name: "Type",
    src: "/work/wethos/foundations-type.webp",
    width: 1600,
    height: 1178,
    caption: "Type: headers, body sizes and eyebrows, each a shared text style.",
  },
  {
    name: "Buttons",
    src: "/work/wethos/ds-buttons.webp",
    width: 1472,
    height: 740,
    caption: "Buttons: primary, outline, text and danger, in three sizes, with hover, focus and disabled.",
  },
  {
    name: "Cards",
    src: "/work/wethos/ds-cards.webp",
    width: 1600,
    height: 905,
    caption: "Debit cards for Wethos banking: physical and virtual, number hidden or shown, and inactive.",
  },
];

export function DesignSystem() {
  const [active, setActive] = useState(0);
  const page = PAGES[active];

  return (
    <figure className={demo.demo}>
      <div className={styles.dsFrame}>
        {PAGES.map((p, i) => (
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

      <div className={demo.toggle} role="group" aria-label="Design system pages">
        {PAGES.map((p, i) => (
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
