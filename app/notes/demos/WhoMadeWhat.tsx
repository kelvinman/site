"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./demos.module.css";

/**
 * Who made what in The Last Apostate, layer by layer. The shares are rough proportions from
 * how it was made (the repo's history and the credits), not measurements.
 */
const LAYERS = [
  { name: "Concept", you: 100, note: "Jon, Danny, Vic and me, at the workshop. All human." },
  { name: "Decisions", you: 90, note: "What it should feel like, what to cut, and what wasn't good enough yet. Mostly me." },
  { name: "Code", you: 15, note: "Claude wrote most of it. I read it, steered it and sent it back." },
  { name: "Pixel art", you: 15, note: "Drawn by code Claude wrote, on top of a free sprite sheet by stealthix." },
  { name: "Words", you: 10, note: "Almost all Claude's. I didn't know game writing, and didn't have the time to learn it." },
];

export function WhoMadeWhat() {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const [active, setActive] = useState(0);

  // The bars fill when the figure first scrolls into view.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={ref} className={styles.demo}>
      <ul className={styles.rows}>
        {LAYERS.map((layer, index) => (
          <li key={layer.name}>
            <button
              type="button"
              className={styles.row}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
            >
              <span className={styles.label}>{layer.name}</span>
              <span className={styles.bar} aria-label={`About ${layer.you}% me`}>
                <span className={styles.you} style={{ width: seen ? `${layer.you}%` : "0%", transitionDelay: `${index * 90}ms` }} />
              </span>
              <span className={styles.share}>{layer.you}%</span>
            </button>
          </li>
        ))}
      </ul>
      <p className={styles.legend}>
        <span>
          <i className={`${styles.swatch} ${styles.swatchMe}`} />
          Me
        </span>
        <span>
          <i className={`${styles.swatch} ${styles.swatchAi}`} />
          AI
        </span>
      </p>
      <figcaption className={styles.caption} aria-live="polite">
        <strong>{LAYERS[active].name}.</strong> {LAYERS[active].note}
      </figcaption>
    </figure>
  );
}
