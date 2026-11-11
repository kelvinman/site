"use client";

import { useId, useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./artifice.module.css";

/**
 * Artifice's feature analysis, rebuilt from the launch screenshot of Model 1 (Feb 2023): for one column,
 * its range and spread, and the curve the model learned for it, drawn over the input keypoints the way
 * the product drew it. Cholesterol's stats, keypoints and curve are read off that screenshot. The other
 * three columns are stand-ins: their stats are the public heart disease table's, their curves are shapes.
 */
type Feature = {
  key: string;
  label: string;
  stats: [string, string][];
  keypoints: number[];
  outputs: number[];
};

const FEATURES: Feature[] = [
  {
    key: "chol",
    label: "chol",
    stats: [["Min", "126.0"], ["Max", "564.0"], ["Mean", "247.0"], ["Std", "52.85"]],
    keypoints: [131, 186, 209, 225, 240, 256, 273, 295, 318, 409],
    outputs: [-2.18, -1.59, -1.46, -1.41, -1.33, -1.16, -1.02, -0.69, -0.32, 1.21],
  },
  {
    key: "age",
    label: "age",
    stats: [["Min", "29.0"], ["Max", "77.0"], ["Mean", "54.4"], ["Std", "9.08"]],
    keypoints: [34, 41, 45, 50, 54, 57, 59, 62, 66, 74],
    outputs: [-1.9, -1.55, -1.3, -0.95, -0.55, -0.2, 0.1, 0.45, 0.8, 1.05],
  },
  {
    key: "trestbps",
    label: "trestbps",
    stats: [["Min", "94.0"], ["Max", "200.0"], ["Mean", "131.6"], ["Std", "17.54"]],
    keypoints: [100, 110, 118, 120, 125, 130, 135, 140, 150, 172],
    outputs: [-1.2, -1.1, -1.0, -0.95, -0.85, -0.7, -0.5, -0.25, 0.15, 0.9],
  },
  {
    key: "thalach",
    label: "thalach",
    stats: [["Min", "71.0"], ["Max", "202.0"], ["Mean", "149.6"], ["Std", "22.91"]],
    keypoints: [97, 116, 132, 142, 152, 158, 163, 170, 178, 192],
    outputs: [1.4, 1.0, 0.55, 0.2, -0.15, -0.45, -0.8, -1.2, -1.6, -2.1],
  },
];

// The chart's frame, in SVG units: the product's -2.5 to 1.5 scale and evenly spaced keypoints.
const W = 560;
const H = 220;
const PAD = { l: 44, r: 14, t: 12, b: 32 };
const Y_MIN = -2.5;
const Y_MAX = 1.5;
const TICKS = [1.5, 1, 0.5, 0, -0.5, -1, -1.5, -2, -2.5];

const x = (i: number, n: number) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r);
const y = (v: number) => PAD.t + ((Y_MAX - v) / (Y_MAX - Y_MIN)) * (H - PAD.t - PAD.b);

export function ArtificeExplain() {
  const [featureKey, setFeatureKey] = useState("chol");
  const [pos, setPos] = useState(4);
  const sliderId = useId();
  const f = FEATURES.find((g) => g.key === featureKey) ?? FEATURES[0];
  const n = f.keypoints.length;

  // Between two keypoints, the model's curve is a straight line, so input and output interpolate together.
  const i = Math.min(Math.floor(pos), n - 2);
  const t = pos - i;
  const input = f.keypoints[i] + t * (f.keypoints[i + 1] - f.keypoints[i]);
  const output = f.outputs[i] + t * (f.outputs[i + 1] - f.outputs[i]);
  const path = f.outputs.map((v, k) => `${k ? "L" : "M"}${x(k, n).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <figure className={demo.demo}>
      <div className={`${styles.library} ${styles.explain}`}>
        <div className={styles.features} role="group" aria-label="Column">
          {FEATURES.map((g) => (
            <button key={g.key} type="button" aria-pressed={g.key === featureKey} onClick={() => setFeatureKey(g.key)}>
              {g.label}
            </button>
          ))}
        </div>

        <dl className={styles.statRow}>
          {f.stats.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.chart}>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`How ${f.label} changes the model's output, from ${f.outputs[0]} at ${f.keypoints[0]} to ${f.outputs[n - 1]} at ${f.keypoints[n - 1]}.`}>
            {TICKS.map((v) => (
              <g key={v}>
                <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className={styles.grid} />
                <text x={PAD.l - 6} y={y(v) + 3} textAnchor="end" className={styles.tick}>
                  {v}
                </text>
              </g>
            ))}
            {f.keypoints.map((k, idx) => (
              <text key={idx} x={x(idx, n)} y={H - 6} textAnchor="middle" className={styles.tick}>
                {k}
              </text>
            ))}
            <line x1={x(pos, n)} x2={x(pos, n)} y1={PAD.t} y2={H - PAD.b} className={styles.cursor} />
            <path d={path} className={styles.curve} />
            {f.outputs.map((v, k) => (
              <circle key={k} cx={x(k, n)} cy={y(v)} r={2.5} className={styles.point} />
            ))}
            <circle cx={x(pos, n)} cy={y(output)} r={5} className={styles.now} />
          </svg>
        </div>

        <div className={styles.readout}>
          <label htmlFor={sliderId}>
            {f.label} <b>{input.toFixed(0)}</b>
          </label>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={n - 1}
            step={0.01}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            className={styles.range}
          />
          <span>
            Output <b>{output.toFixed(2)}</b>
          </span>
        </div>
      </div>

      <figcaption className={demo.caption}>
        Drag along a column&apos;s values to see the model&apos;s output move. The cholesterol curve is read off the
        launch screenshot. The other three columns are stand-ins.
      </figcaption>
    </figure>
  );
}
