"use client";

import { useEffect, useRef, useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./chat.module.css";

/**
 * The estimate flow from the Hi-Fi design, rebuilt so it can be tapped through: a description, two
 * quick-reply questions, a short search, then the range with the cases behind it. The first question and
 * the range come from the Hi-Fi file; the arrest question follows the journey map ("injury, arrest,
 * etc."); the cases are real settlements from the repo's city data. The real backend isn't reachable, so
 * this is a recreation, not the product.
 */
const QUESTIONS = ["Did you receive medical treatment afterward?", "Were you arrested?"];

/** Four real settlements in the range from the city's data, names cut to initials as the product does. */
const CASES = [
  { name: "G., C. vs City of New York", amount: "$45,000", date: "Jan 21, 2021" },
  { name: "A., E. vs City of New York", amount: "$35,000", date: "Jun 8, 2023" },
  { name: "W., G. vs City of New York", amount: "$30,000", date: "Sep 11, 2020" },
  { name: "S., F. vs City of New York", amount: "$25,000", date: "Jul 8, 2022" },
];

/** How long the assistant "types" before each question, and how long the search takes. */
const TYPING = 900;
const SEARCHING = 1600;

type Phase = "asking" | "typing" | "searching" | "done";

export function ChatEstimate() {
  const [answers, setAnswers] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("asking");
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function after(ms: number, fn: () => void) {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.push(window.setTimeout(fn, still ? 0 : ms));
  }

  function answer(a: string) {
    const next = [...answers, a];
    setAnswers(next);
    if (next.length < QUESTIONS.length) {
      setPhase("typing");
      after(TYPING, () => setPhase("asking"));
    } else {
      setPhase("typing");
      after(TYPING / 2, () => {
        setPhase("searching");
        after(SEARCHING, () => setPhase("done"));
      });
    }
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setAnswers([]);
    setPhase("asking");
  }

  // Questions shown so far: every answered one, plus the next once the assistant has finished typing.
  const shown = phase === "asking" ? answers.length + 1 : answers.length;

  return (
    <figure className={demo.demo}>
      <div className={styles.frame}>
        {phase !== "done" ? (
          <div className={styles.panel}>
            <div className={styles.chat}>
              <p className={styles.mine}>Officers used force during my arrest and I needed stitches</p>
              <p className={styles.theirs}>
                I&apos;m sorry that happened to you. I&apos;ll ask a few quick questions so we can give you the most
                accurate estimate.
              </p>
              {QUESTIONS.slice(0, shown).map((q, i) => (
                <div key={q} className={styles.turn}>
                  <p className={styles.theirs}>{q}</p>
                  {answers[i] ? (
                    <p className={styles.mine}>{answers[i]}</p>
                  ) : (
                    <div className={styles.chips}>
                      {["Yes", "No"].map((a) => (
                        <button key={a} type="button" className={styles.chip} onClick={() => answer(a)}>
                          {a}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {phase === "typing" && (
                <p className={styles.typing} aria-label="Typing">
                  <span />
                  <span />
                  <span />
                </p>
              )}
              {phase === "searching" && <p className={styles.searching}>Finding similar settlements…</p>}
            </div>
            <div className={styles.input} aria-hidden="true">
              Type your question…<span className={styles.send}>↑</span>
            </div>
          </div>
        ) : (
          <div className={styles.result}>
            <div className={styles.range}>
              <p className={styles.rangeLabel}>Estimated settlement range</p>
              <p className={styles.rangeValue}>$25,000 – $50,000</p>
              <p className={styles.disclaimer}>
                These figures are estimates, not guarantees. Only a licensed attorney can evaluate your specific claim.
              </p>
              <div className={styles.actions}>
                <span className={styles.primary}>Meet with a vetted attorney</span>
                <span className={styles.secondary}>Connect with Sidecar Legal</span>
              </div>
            </div>
            <p className={styles.basedOn}>Based on {CASES.length} similar NYPD cases</p>
            <ul className={styles.cases}>
              {CASES.map((c) => (
                <li key={c.amount}>
                  <span className={styles.caseName}>{c.name}</span>
                  <b>{c.amount}</b>
                  <span className={styles.caseDate}>{c.date}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={demo.controls}>
        <button type="button" className={demo.quiet} onClick={reset} disabled={answers.length === 0}>
          Start over
        </button>
      </div>
      <figcaption className={demo.caption}>
        The Hi-Fi flow rebuilt to tap through. The range is the design&apos;s sample; the cases are real settlements from the city&apos;s data, shortened to initials.
      </figcaption>
    </figure>
  );
}
