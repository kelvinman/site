"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import { STAGES } from "./journeyData";
import styles from "./journey.module.css";

const W = 600;
const H = 320;
/** Room above the highest point for the card, and below the lowest. */
const TOP = 160;
const BOTTOM = 20;

/** Where each stage sits on the chart, from its mood. */
const PTS = STAGES.map((s, i) => ({
  x: Math.round(((i + 0.5) / STAGES.length) * W),
  y: Math.round(H - BOTTOM - s.mood * (H - TOP - BOTTOM)),
}));

/** A smooth line through the points, bending halfway between each pair. */
const LINE = PTS.map((p, i) => {
  if (i === 0) return `M ${p.x} ${p.y}`;
  const prev = PTS[i - 1];
  const mid = (prev.x + p.x) / 2;
  return `C ${mid} ${prev.y}, ${mid} ${p.y}, ${p.x} ${p.y}`;
}).join(" ");

/** Percent positions for a point, rounded so server and client render the same style. */
function at(p: { x: number; y: number }) {
  return { left: `${Math.round((p.x / W) * 10000) / 100}%`, top: `${Math.round((p.y / H) * 10000) / 100}%` };
}

/** The journey map as a curve of how the person feels; the active stage's words sit in a card above its point. */
export function Journey() {
  const [active, setActive] = useState(2);
  const s = STAGES[active];
  // Keep the card inside the chart: at the ends it hangs inward from the point instead of centring on it.
  const align = active === 0 ? "start" : active === STAGES.length - 1 ? "end" : "middle";

  return (
    <figure className={demo.demo}>
      <div className={styles.curve}>
        <div className={styles.chart} style={{ height: H }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <path d={LINE} className={styles.line} />
          </svg>
          {STAGES.map((st, i) => (
            <button
              key={st.name}
              type="button"
              className={styles.point}
              style={at(PTS[i])}
              aria-pressed={i === active}
              aria-label={`${st.name}: ${st.feeling}`}
              onClick={() => setActive(i)}
            />
          ))}
          <div key={active} className={styles.callout} data-align={align} style={at(PTS[active])} aria-live="polite">
            <p className={styles.feeling}>{s.feeling}</p>
            <p className={styles.calloutThought}>&ldquo;{s.thought}&rdquo;</p>
            <p className={styles.calloutAnswer}>
              {s.risk}, so {s.answer}.
            </p>
          </div>
        </div>
        <div className={styles.stages} aria-hidden="true">
          {STAGES.map((st, i) => (
            <span key={st.name} data-active={i === active || undefined}>
              {st.name}
            </span>
          ))}
        </div>
      </div>
      <figcaption className={demo.caption}>
        From my journey map, made before any screens. Tap a stage to read it.
      </figcaption>
    </figure>
  );
}
