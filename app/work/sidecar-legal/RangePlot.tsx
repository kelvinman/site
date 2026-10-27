"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import moment from "../moment/moment.module.css";
import data from "./settlements.json";
import styles from "./range.module.css";

/**
 * Why the estimate is a range. Every NYPD settlement in the city's data on misconduct matters commenced in
 * FY 2020 to 2024 (the file the estimator was built on), deduplicated by case name and limited to cases
 * settled for more than $0, counted into bins on a log scale. Bars inside the middle half are highlighted.
 * Built from the nypd-payout-predictor repo, 27 Oct 2026. Counts only, no case names.
 */
const TICKS = [1_000, 10_000, 100_000, 1_000_000, 10_000_000];

/** Position on the log scale, in percent of the width, rounded so server and client render the same style. */
function x(amount: number) {
  const pct = ((Math.log10(amount) - Math.log10(data.min)) / (Math.log10(data.max) - Math.log10(data.min))) * 100;
  return Math.round(pct * 100) / 100;
}

/** The lowest amount in a bin. */
function binStart(i: number) {
  const lo = Math.log10(data.min);
  const hi = Math.log10(data.max);
  return 10 ** (lo + ((hi - lo) * i) / data.bins);
}

/** Full amounts for the summary: $16,500. */
function usd(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

/** Short amounts for the axis: $10k, $1M. */
function money(n: number) {
  if (n >= 1_000_000) return `$${n / 1_000_000}M`;
  return `$${Math.round(n / 1_000)}k`;
}

export function RangePlot() {
  const [active, setActive] = useState(0);
  const group = data.groups[active];
  const tallest = Math.max(...group.counts);

  return (
    <figure className={demo.demo}>
      <div className={styles.plot}>
        <p className={styles.summary}>
          <b>
            {usd(group.p25)} – {usd(group.p75)}
          </b>{" "}
          is the middle half of {group.count.toLocaleString("en-US")} settlements. The median is {usd(group.p50)}.
        </p>
        <div
          className={styles.field}
          role="img"
          aria-label={`A histogram of ${group.count} settlements on a log scale, most between ${usd(group.p25)} and ${usd(group.p75)}`}
        >
          {group.counts.map((n, i) => {
            const mid = Math.sqrt(binStart(i) * binStart(i + 1));
            const inside = mid >= group.p25 && mid <= group.p75;
            return (
              <span
                key={i}
                className={styles.bar}
                data-inside={inside || undefined}
                style={{ height: `${n ? Math.max(2, Math.round((n / tallest) * 1000) / 10) : 0}%` }}
              />
            );
          })}
          <span className={styles.median} style={{ left: `${x(group.p50)}%` }} />
        </div>
        <div className={styles.axis} aria-hidden="true">
          {TICKS.map((t) => (
            <span key={t} style={{ left: `${x(t)}%` }}>
              {money(t)}
            </span>
          ))}
        </div>
      </div>
      <div className={demo.controls}>
        {data.groups.map((g, i) => (
          <button key={g.name} type="button" className={moment.jump} aria-pressed={i === active} onClick={() => setActive(i)}>
            {g.name}
          </button>
        ))}
      </div>
      <figcaption className={demo.caption}>
        Every settled NYPD case in the city&apos;s data, by amount on a log scale. The highlight is the middle half.
      </figcaption>
    </figure>
  );
}
