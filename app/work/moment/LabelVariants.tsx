"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./moment.module.css";

/** Six treatments of one place label from the In World Modules file, each cropped around its label. */
const VARIANTS = ["Pin", "Stacked", "Icon", "Dots", "Diamond", "Outlined"];

export function LabelVariants() {
  const [active, setActive] = useState(0);

  return (
    <figure className={demo.demo}>
      <div className={styles.labelStage}>
        {VARIANTS.map((name, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
          <img
            key={name}
            src={`/work/moment/label-${i + 1}.webp`}
            alt={i === active ? `The Explore the Mountains label, ${name.toLowerCase()} treatment` : ""}
            width={1280}
            height={544}
            className={styles.screen}
            data-active={i === active || undefined}
          />
        ))}
      </div>
      <div className={demo.controls}>
        {VARIANTS.map((name, i) => (
          <button key={name} type="button" className={styles.jump} aria-pressed={i === active} onClick={() => setActive(i)}>
            {name}
          </button>
        ))}
      </div>
      <figcaption className={demo.caption}>Six of the treatments I tried for one place label, over the same scene.</figcaption>
    </figure>
  );
}
