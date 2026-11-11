"use client";

import { useEffect, useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./artifice.module.css";

/**
 * One dataset card from Artifice's data library, rebuilt from the launch screenshots (Feb 2023) so its
 * parts can be tried: the status tag, the one action that fits each status, and the counts underneath.
 * The card, tags, colours and numbers follow the screenshots (Heart.csv, 303 rows, 14 columns, eight
 * models, a best test AUC of 0.958); the timing is a stand-in for work that took minutes.
 */
type Stage = "raw" | "cleaning" | "clean" | "training" | "trained";

const STAGES: Record<Stage, { tag: string; tone: "plain" | "busy" | "done"; action?: string; next: Stage }> = {
  raw: { tag: "Raw", tone: "plain", action: "Clean", next: "cleaning" },
  cleaning: { tag: "Cleaning", tone: "busy", next: "clean" },
  clean: { tag: "Clean", tone: "done", action: "Train", next: "training" },
  training: { tag: "Training", tone: "busy", next: "trained" },
  trained: { tag: "Trained", tone: "done", next: "trained" },
};

export function ArtificeCard() {
  const [stage, setStage] = useState<Stage>("raw");
  const s = STAGES[stage];
  const busy = s.tone === "busy";

  // The two working states move on by themselves, the way the real card updated when a job finished.
  useEffect(() => {
    if (!busy) return;
    const t = window.setTimeout(() => setStage(s.next), 1800);
    return () => window.clearTimeout(t);
  }, [busy, s.next]);

  const models = stage === "trained" ? 8 : 0;

  return (
    <figure className={demo.demo}>
      <div className={styles.library}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <div>
              <p className={styles.cardTitle}>
                Heart.csv
                <span className={styles.tag} data-tone={s.tone} aria-live="polite">
                  {s.tag}
                </span>
              </p>
              <p className={styles.edited}>Edited just now</p>
            </div>
            {s.action ? (
              <button type="button" className={styles.primary} onClick={() => setStage(s.next)}>
                {s.action}
              </button>
            ) : (
              <span className={styles.primary} data-off="true" aria-hidden="true">
                {stage === "trained" ? "Run inference" : s.tag}
              </span>
            )}
          </div>

          <div className={styles.progress} data-on={busy} aria-hidden="true">
            <span />
          </div>

          <dl className={styles.counts}>
            <div>
              <dt>Rows</dt>
              <dd>303</dd>
            </div>
            <div>
              <dt>{stage === "raw" || stage === "cleaning" ? "Columns" : "Features"}</dt>
              <dd>{stage === "raw" || stage === "cleaning" ? 14 : 13}</dd>
            </div>
            <div>
              <dt>Models</dt>
              <dd>{models}</dd>
            </div>
            <div>
              <dt>Best AUC</dt>
              <dd>{stage === "trained" ? "0.958" : "…"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className={demo.controls}>
        <button type="button" className={demo.quiet} disabled={stage === "raw"} onClick={() => setStage("raw")}>
          Start over
        </button>
      </div>

      <figcaption className={demo.caption}>
        A dataset card from the library, rebuilt in code from the launch screenshots. Press its button to clean the
        table, then train it. The tag and the button change with each step.
      </figcaption>
    </figure>
  );
}
