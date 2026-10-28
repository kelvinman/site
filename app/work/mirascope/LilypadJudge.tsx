"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./lilypad.module.css";

/**
 * Lilypad's annotation view from the [Mirascope] Lilypad file (page V5), rebuilt so it can be tried:
 * one LLM call, two versions of the function behind it, and the team's criteria to mark pass or fail.
 * The function, input and numbers come from the design file's sample trace; the two outputs and the
 * criteria are stand-ins that show why versions get compared on evidence.
 */
type Version = "v1" | "v2";
type Mark = "pass" | "fail" | undefined;

const CRITERIA = ["Answers the question", "Matches the tone", "Under 25 words"];

const CALLS: Record<Version, { output: string; cost: string; latency: string }> = {
  v1: {
    output:
      "France has a long and rich history, and its capital has moved over the centuries, but these days most people would agree that it is Paris.",
    cost: "$0.00005",
    latency: "1,204ms",
  },
  v2: {
    output: "Paris, obviously. Where else would you keep that many croissants?",
    cost: "$0.00003",
    latency: "806ms",
  },
};

export function LilypadJudge() {
  const [version, setVersion] = useState<Version>("v1");
  const [marks, setMarks] = useState<Record<Version, Mark[]>>({ v1: [], v2: [] });
  const call = CALLS[version];

  function mark(i: number, m: Mark) {
    setMarks((all) => {
      const next = [...all[version]];
      next[i] = next[i] === m ? undefined : m;
      return { ...all, [version]: next };
    });
  }

  function score(v: Version) {
    const done = marks[v].filter(Boolean).length;
    const passed = marks[v].filter((m) => m === "pass").length;
    return { done, passed };
  }

  return (
    <figure className={demo.demo}>
      <div className={styles.app}>
        <div className={styles.head}>
          <div className={styles.fnRow}>
            <p className={styles.fn}>answer_question</p>
            <span className={styles.versions} role="group" aria-label="Version">
              {(["v1", "v2"] as Version[]).map((v) => (
                <button key={v} type="button" aria-pressed={v === version} onClick={() => setVersion(v)}>
                  {v}
                </button>
              ))}
            </span>
          </div>
          <div className={styles.metrics}>
            <span>
              Cost <b>{call.cost}</b>
            </span>
            <span>
              Latency <b>{call.latency}</b>
            </span>
          </div>
        </div>

        <div className={styles.io}>
          <div className={styles.col}>
            <p className={styles.label}>Input</p>
            <div className={styles.box}>
              <p className={styles.key}>question</p>
              <p>What is the capital of France?</p>
              <p className={styles.key}>tone</p>
              <p>witty</p>
            </div>
          </div>
          <div className={styles.col}>
            <p className={styles.label}>Output</p>
            <p className={styles.box}>{call.output}</p>
          </div>
        </div>

        <div className={styles.criteria}>
          {CRITERIA.map((c, i) => {
            const m = marks[version][i];
            return (
              <div key={c} className={styles.criterion}>
                <span>{c}</span>
                <span className={styles.toggle}>
                  <button type="button" aria-pressed={m === "pass"} data-kind="pass" onClick={() => mark(i, "pass")}>
                    Pass
                  </button>
                  <button type="button" aria-pressed={m === "fail"} data-kind="fail" onClick={() => mark(i, "fail")}>
                    Fail
                  </button>
                </span>
              </div>
            );
          })}
        </div>

        <div className={styles.compare}>
          {(["v1", "v2"] as Version[]).map((v) => {
            const s = score(v);
            return (
              <button
                key={v}
                type="button"
                className={styles.score}
                aria-pressed={v === version}
                onClick={() => setVersion(v)}
              >
                <span>{v}</span>
                <span className={styles.bar}>
                  <span style={{ width: `${(s.passed / CRITERIA.length) * 100}%` }} />
                </span>
                <span className={styles.count}>{s.done ? `${s.passed} of ${CRITERIA.length} passed` : "not judged"}</span>
              </button>
            );
          })}
        </div>
      </div>

      <figcaption className={demo.caption}>
        Mark each criterion for v1, then switch to v2 at the top. The comparison fills in as you go.
      </figcaption>
    </figure>
  );
}
