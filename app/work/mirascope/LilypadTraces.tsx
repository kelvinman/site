"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./lilypad.module.css";

/**
 * Lilypad's Traces view from the [Mirascope] Lilypad file (page V5), rebuilt so it can be clicked: a
 * list of traced LLM calls with their version and result, and the open call's cost, latency,
 * input and output beside it. Ids, versions and numbers follow the design file's sample traces;
 * the outputs are stand-ins.
 */
type Trace = {
  id: string;
  version: string;
  result: "pass" | "fail";
  age: string;
  cost: string;
  latency: string;
  question: string;
  output: string;
};

const TRACES: Trace[] = [
  {
    id: "d0040b8a",
    version: "v2",
    result: "fail",
    age: "5m",
    cost: "$0.00006",
    latency: "1,410ms",
    question: "What were our sales last quarter?",
    output: "I don't have access to that information, but most businesses see seasonal changes.",
  },
  {
    id: "7c21e9f0",
    version: "v4",
    result: "pass",
    age: "20m",
    cost: "$0.00003",
    latency: "806ms",
    question: "Which plan is this customer on?",
    output: "They're on the Team plan, billed yearly, renewing on 3 March.",
  },
  {
    id: "3b8d4a12",
    version: "v5",
    result: "pass",
    age: "1h",
    cost: "$0.00004",
    latency: "932ms",
    question: "How many orders shipped yesterday?",
    output: "142 orders shipped yesterday, 9 more than the day before.",
  },
  {
    id: "e5f60c77",
    version: "v3",
    result: "pass",
    age: "2h",
    cost: "$0.00005",
    latency: "1,120ms",
    question: "Who owns the Acme account?",
    output: "Priya Shah owns the Acme account; it last changed hands in June.",
  },
  {
    id: "91aa2d3e",
    version: "v1",
    result: "fail",
    age: "2h",
    cost: "$0.00007",
    latency: "1,890ms",
    question: "Summarise this week's support tickets.",
    output: "There were tickets this week about various topics, including several issues.",
  },
];

export function LilypadTraces() {
  const [open, setOpen] = useState(0);
  const t = TRACES[open];

  return (
    <figure className={demo.demo}>
      <div className={`${styles.app} ${styles.wide}`}>
        <div className={styles.head}>
          <p className={styles.fn}>Traces</p>
          <span className={styles.metrics}>{TRACES.length} calls, newest first</span>
        </div>
        <div className={styles.traces}>
          <ul className={styles.traceList}>
            {TRACES.map((x, i) => (
              <li key={x.id}>
                <button type="button" className={styles.trace} aria-pressed={i === open} onClick={() => setOpen(i)}>
                  <span className={styles.traceId}>{x.id}</span>
                  <span className={styles.traceVersion}>{x.version}</span>
                  <span className={styles.result} data-kind={x.result}>
                    {x.result === "pass" ? "Pass" : "Fail"}
                  </span>
                  <span className={styles.traceAge}>{x.age}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.detail} aria-live="polite">
            <div className={styles.detailHead}>
              <p className={styles.fn}>
                answer_question <span className={styles.badge}>{t.version}</span>
              </p>
              <span className={styles.stats}>
                <span>{t.cost}</span>
                <span>{t.latency}</span>
              </span>
            </div>
            <div className={styles.field}>
              <p className={styles.label}>Input</p>
              <p>{t.question}</p>
            </div>
            <div className={styles.field}>
              <p className={styles.label}>Output</p>
              <p>{t.output}</p>
            </div>
          </div>
        </div>
      </div>
      <figcaption className={demo.caption}>
        Every call to the model, traced. Open one to see what it was asked, what it said, and what it cost.
      </figcaption>
    </figure>
  );
}
