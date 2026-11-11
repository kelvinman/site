"use client";

import { useEffect, useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./lilypad.module.css";

/**
 * Lilypad's playground and organization tags from the [Mirascope] Lilypad file as shown in his Looms of
 * 11 Apr and 4 May 2025: two versions of a function side by side, each with its prompt and its own
 * response, one Run for both, and tags that are set once for the organization rather than typed per
 * trace. The layout, the tag names (Bug, Feature, Improvement) and their colours follow the design;
 * the prompts and responses are stand-ins, matching the annotation demo's.
 */
type Version = "v1" | "v2";

const PROMPTS: Record<Version, { system: string; response: string }> = {
  v1: {
    system: "Answer the user's question.",
    response:
      "France has a long and rich history, and its capital has moved over the centuries, but these days most people would agree that it is Paris.",
  },
  v2: {
    system: "Answer in one sentence, in the tone the user asks for.",
    response: "Paris, obviously. Where else would you keep that many croissants?",
  },
};

const TAGS = [
  { name: "Bug", color: "#d63384" },
  { name: "Feature", color: "#6f42c1" },
  { name: "Improvement", color: "#3b82f6" },
];

export function LilypadPlayground() {
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [tags, setTags] = useState<Record<Version, string[]>>({ v1: [], v2: [] });

  useEffect(() => {
    if (state !== "running") return;
    const t = window.setTimeout(() => setState("done"), 900);
    return () => window.clearTimeout(t);
  }, [state]);

  function toggle(v: Version, name: string) {
    setTags((all) => ({
      ...all,
      [v]: all[v].includes(name) ? all[v].filter((n) => n !== name) : [...all[v], name],
    }));
  }

  return (
    <figure className={demo.demo}>
      <div className={`${styles.app} ${styles.wide}`}>
        <div className={styles.head}>
          <div className={styles.fnRow}>
            <p>Playground</p>
            <span className={styles.badge}>answer_question</span>
          </div>
          <button
            type="button"
            className={styles.run}
            disabled={state === "running"}
            onClick={() => setState("running")}
          >
            {state === "running" ? "Running" : "Run"}
          </button>
        </div>

        <div className={styles.io}>
          {(["v1", "v2"] as Version[]).map((v) => (
            <div key={v} className={styles.pane}>
              <p className={styles.paneHead}>
                <span className={styles.fn}>{v}</span>
              </p>
              <div className={styles.field}>
                <p className={styles.label}>System prompt</p>
                <p className={styles.prompt}>{PROMPTS[v].system}</p>
              </div>
              <div className={styles.field}>
                <p className={styles.label}>User</p>
                <p className={styles.prompt}>What is the capital of France? Make it witty.</p>
              </div>
              <div className={styles.field}>
                <p className={styles.label}>Response</p>
                <p className={styles.response} data-state={state} aria-live="polite">
                  {state === "done" ? PROMPTS[v].response : state === "running" ? "Running…" : "Press Run to call both versions."}
                </p>
              </div>
              <div className={styles.tagRow} role="group" aria-label={`Tags for ${v}`}>
                {TAGS.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    className={styles.orgTag}
                    style={{ "--tag": t.color } as React.CSSProperties}
                    aria-pressed={tags[v].includes(t.name)}
                    disabled={state !== "done"}
                    onClick={() => toggle(v, t.name)}
                  >
                    <span aria-hidden="true" />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <figcaption className={demo.caption}>
        Run both versions at once, then tag the results. The tags come from the organization&apos;s settings, so
        the whole team files calls under the same names.
      </figcaption>
    </figure>
  );
}
