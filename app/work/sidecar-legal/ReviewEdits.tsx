"use client";

import { useEffect, useRef, useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./review.module.css";
import { WordChrome } from "./WordChrome";

/**
 * The review step from the [Sidecar] Improvement Detail file (V9), rebuilt so it can be tried: a response to
 * form interrogatories in Word, and the add-in stepping through the AI's improvements one at a time, each
 * with the source it cites. The 3.7 objection and its source come from the design file's sample; the other
 * improvements and sources are stand-ins of the same kind. "Grouped" shows the alternative he argued
 * against in his 30 May 2025 Loom: the same changes, accepted together, with the sources out of sight.
 */
type Improvement = {
  id: string;
  title: string;
  label: string;
  before: string;
  after: [string, string];
  cite: string;
  source: string;
};

const IMPROVEMENTS: Improvement[] = [
  {
    id: "prelim",
    title: "Preliminary statement",
    label: "Preliminary statement",
    before: "These responses are based on what Defendant knows now.",
    after: [
      "These responses are made solely for the purpose of this action and are based on information presently available to Defendant.",
      "These responses are made only for this action, and are based on what Defendant knows today.",
    ],
    cite: "These responses are made solely for the purpose of this action.",
    source: "Your past response, 2024.docx",
  },
  {
    id: "3.6",
    title: "3.6: Fictitious business name",
    label: "Form Interrogatory No. 3.6",
    before: "Defendant objects.",
    after: [
      "Not applicable. Defendant is an individual and has never done business under a fictitious name.",
      "Not applicable. Defendant has not used any fictitious business name.",
    ],
    cite: "Tenant: the Defendant, an individual.",
    source: "Lease agreement.pdf, page 1",
  },
  {
    id: "3.7",
    title: "3.7: Business licensing",
    label: "Form Interrogatory No. 3.7",
    before: "Defendant objects.",
    after: [
      "Objection. This interrogatory seeks irrelevant information not reasonably calculated to lead to the discovery of admissible evidence.",
      "Objection. Business licenses have no bearing on this unlawful detainer action, so this interrogatory seeks irrelevant information.",
    ],
    cite: "Objection, interrogatory seeks irrelevant information not reasonably calculated to lead to the discovery of admissible evidence.",
    source: "Common Objections to Discovery Requests, California Courts Guide.pdf",
  },
  {
    id: "4.1",
    title: "4.1: Insurance policy",
    label: "Form Interrogatory No. 4.1",
    before: "None.",
    after: [
      "No. Defendant holds no policy of insurance that may cover the damages claimed.",
      "No. Defendant has no insurance policy that applies to this claim.",
    ],
    cite: "Client says he has never had renter's insurance.",
    source: "Client intake notes.docx",
  },
];

type Mode = "one" | "grouped";

export function ReviewEdits() {
  const [mode, setMode] = useState<Mode>("one");
  const [current, setCurrent] = useState(0);
  const [accepted, setAccepted] = useState<boolean[]>(IMPROVEMENTS.map(() => false));
  const [rewritten, setRewritten] = useState<boolean[]>(IMPROVEMENTS.map(() => false));
  const [view, setView] = useState<"text" | "pdf">("text");
  const docRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const left = accepted.filter((a) => !a).length;
  const done = left === 0;
  const item = IMPROVEMENTS[current];

  // Keep the improvement under review in view inside the document, without scrolling the page.
  useEffect(() => {
    const doc = docRef.current;
    const el = itemRefs.current[current];
    if (!doc || !el || mode !== "one") return;
    // The page is positioned, so offsetTop is already measured from its top. The first item stays at the top.
    const top = current === 0 ? 0 : el.offsetTop - 24;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    doc.scrollTo({ top, behavior: still ? "auto" : "smooth" });
  }, [current, mode]);

  function move(step: number) {
    setCurrent((c) => Math.min(IMPROVEMENTS.length - 1, Math.max(0, c + step)));
  }

  function accept() {
    const next = accepted.map((a, i) => a || i === current);
    setAccepted(next);
    // Move on to the next improvement still open, after this one if there is one.
    const order = [...IMPROVEMENTS.keys()].map((k) => (current + 1 + k) % IMPROVEMENTS.length);
    const open = order.find((i) => !next[i]);
    if (open !== undefined) setCurrent(open);
  }

  function rewrite() {
    setRewritten((r) => r.map((v, i) => (i === current ? !v : v)));
  }

  function acceptAll() {
    setAccepted(IMPROVEMENTS.map(() => true));
  }

  function reset() {
    setAccepted(IMPROVEMENTS.map(() => false));
    setRewritten(IMPROVEMENTS.map(() => false));
    setCurrent(0);
    docRef.current?.scrollTo({ top: 0 });
  }

  function onKey(e: React.KeyboardEvent) {
    if (mode !== "one") return;
    if (e.key === "[") move(-1);
    if (e.key === "]") move(1);
  }

  const text = (i: number) => IMPROVEMENTS[i].after[rewritten[i] ? 1 : 0];

  return (
    <figure className={demo.demo}>
      <div className={styles.app} tabIndex={0} onKeyDown={onKey} aria-label="Sidecar add-in beside a Word document">
        <WordChrome title="Response to Form Interrogatories.docx" />
        <div className={styles.doc} ref={docRef}>
          <p className={styles.caption}>DEFENDANT&apos;S RESPONSE TO FORM INTERROGATORIES, SET ONE</p>
          {IMPROVEMENTS.map((imp, i) => {
            const isCurrent = mode === "one" && i === current && !done;
            return (
              <p
                key={imp.id}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={styles.para}
                data-current={isCurrent || undefined}
                data-open={!accepted[i] || undefined}
              >
                <b>{imp.label}:</b>{" "}
                {accepted[i] ? (
                  text(i)
                ) : (
                  <>
                    <del>{imp.before}</del> <ins>{text(i)}</ins>
                  </>
                )}
              </p>
            );
          })}
        </div>

        <div className={styles.pane}>
          <div className={styles.paneHead}>
            <span className={styles.brand}>Sidecar</span>
            <span className={styles.tabs} aria-hidden="true">
              <span data-on>Draft</span>
              <span>Chat</span>
              <span>Case Files</span>
            </span>
          </div>

          {done ? (
            <div className={styles.done}>
              <span className={styles.check} aria-hidden="true">
                ✓
              </span>
              <p>All {IMPROVEMENTS.length} improvements reviewed.</p>
            </div>
          ) : mode === "one" ? (
            <div className={styles.review} key={item.id}>
              <div className={styles.nav}>
                <button type="button" onClick={() => move(-1)} disabled={current === 0} aria-label="Previous improvement">
                  ‹
                </button>
                <span className={styles.count}>
                  {current + 1} of {IMPROVEMENTS.length}
                </span>
                <button
                  type="button"
                  onClick={() => move(1)}
                  disabled={current === IMPROVEMENTS.length - 1}
                  aria-label="Next improvement"
                >
                  ›
                </button>
              </div>
              <p className={styles.title}>{item.title}</p>
              {accepted[current] ? (
                <p className={styles.accepted}>Accepted</p>
              ) : (
                <div className={styles.actions}>
                  <button type="button" className={styles.accept} onClick={accept}>
                    Accept
                  </button>
                  <button type="button" className={styles.rewrite} onClick={rewrite} aria-pressed={rewritten[current]}>
                    Rewrite
                  </button>
                </div>
              )}
              <div className={styles.citeHead}>
                <p className={styles.label}>Cites</p>
                <span className={styles.mini} role="group" aria-label="Show the source as">
                  <button type="button" aria-pressed={view === "text"} onClick={() => setView("text")}>
                    Text
                  </button>
                  <button type="button" aria-pressed={view === "pdf"} onClick={() => setView("pdf")}>
                    PDF
                  </button>
                </span>
              </div>
              {view === "text" ? (
                <blockquote className={styles.cite}>{item.cite}</blockquote>
              ) : (
                <div className={styles.pdf} aria-label={`The cited line, highlighted on the PDF page: ${item.cite}`}>
                  {Array.from({ length: 9 }, (_, k) => (
                    <i key={k} data-hit={k === 4 || k === 5 || undefined} />
                  ))}
                </div>
              )}
              <p className={styles.source}>{item.source}</p>
              <p className={styles.hint}>[ and ] move between improvements</p>
            </div>
          ) : (
            <div className={styles.review}>
              <p className={styles.title}>{left} small improvements</p>
              <ul className={styles.group}>
                {IMPROVEMENTS.map((imp, i) =>
                  accepted[i] ? null : <li key={imp.id}>{imp.title}</li>,
                )}
              </ul>
              <div className={styles.actions}>
                <button type="button" className={styles.accept} onClick={acceptAll}>
                  Accept all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={demo.controls}>
        <span className={demo.toggle} role="group" aria-label="How improvements are shown">
          <button type="button" aria-pressed={mode === "one"} onClick={() => setMode("one")}>
            One at a time
          </button>
          <button type="button" aria-pressed={mode === "grouped"} onClick={() => setMode("grouped")}>
            Grouped
          </button>
        </span>
        <button type="button" className={demo.quiet} onClick={reset} disabled={left === IMPROVEMENTS.length}>
          Start over
        </button>
      </div>
      <figcaption className={demo.caption}>
        The review step, rebuilt so you can try it. One at a time, each change shows its source as plain text or on
        the PDF. Grouped, the same changes go in with one click and no sources in sight. The document is a stand-in.
      </figcaption>
    </figure>
  );
}
