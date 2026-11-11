"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./demos.module.css";

export type Still = {
  /** The toggle's label, such as a date. */
  label: string;
  /** File in public/work/decorx, with its size and alt text. */
  src?: string;
  width?: number;
  height?: number;
  alt?: string;
  /** A rebuilt screen shown in place of an image. */
  view?: React.ReactNode;
  title: string;
  text: string;
};

/**
 * A row of stills you step through with a toggle: one image at a time in a fixed frame, with a short title
 * and sentence under it. Arrow keys move between steps. The images sit stacked so switching never waits on a
 * load; a step can also be a rebuilt screen instead of an image. Under reduced motion they swap without a fade.
 */
export function Stills({ items, caption, label }: { items: Still[]; caption: string; label: string }) {
  const [shown, setShown] = useState(0);
  const item = items[shown];

  function onKey(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (shown + (e.key === "ArrowRight" ? 1 : items.length - 1)) % items.length;
    setShown(next);
    (e.currentTarget.children[next] as HTMLElement | undefined)?.focus();
  }

  return (
    <figure className={demo.demo}>
      <div className={styles.stills}>
        {items.map((s, i) =>
          s.view ? (
            <div key={s.label} data-shown={i === shown || undefined} aria-hidden={i !== shown} inert={i !== shown}>
              {s.view}
            </div>
          ) : (
          // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
          <img
            key={s.label}
            src={`/work/decorx/${s.src}`}
            alt={s.alt}
            width={s.width}
            height={s.height}
            loading="lazy"
            data-shown={i === shown || undefined}
            aria-hidden={i !== shown}
          />
          ),
        )}
      </div>

      <div className={demo.toggle} role="group" aria-label={label} onKeyDown={onKey}>
        {items.map((s, i) => (
          <button key={s.label} type="button" aria-pressed={i === shown} onClick={() => setShown(i)}>
            {s.label}
          </button>
        ))}
      </div>

      <div className={styles.stillText} aria-live="polite">
        <strong>{item.title}</strong>
        <span>{item.text}</span>
      </div>

      <figcaption className={demo.caption}>{caption}</figcaption>
    </figure>
  );
}
