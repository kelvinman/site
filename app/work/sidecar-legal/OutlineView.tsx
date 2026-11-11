"use client";

import { useEffect, useRef, useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./review.module.css";
import outline from "./outline.module.css";
import { WordChrome } from "./WordChrome";

/**
 * The outline from the "Outline View Nesting" page of the [OAI Legal] Welcome Screen file and his 19 May 2025
 * Loom: sections nest many levels deep with lines that show the levels, like Word's own outline, following
 * Shruti's rule to match Word for anything Word already has. Two switches show his other calls: a dark mode
 * to match Word's, and a counter (2 of 3) in place of the half-filled circle the progress used before.
 * Section names follow California form interrogatories; the progress is a stand-in.
 */
type Node = { id: string; title: string; done?: boolean; text?: string; children?: Node[] };

const TREE: Node[] = [
  { id: "prelim", title: "Preliminary statement", done: true, text: "These responses are made solely for the purpose of this action." },
  {
    id: "form",
    title: "Form interrogatories",
    children: [
      {
        id: "3",
        title: "3.0 Business entity",
        children: [
          { id: "3.6", title: "3.6 Fictitious business name", done: true, text: "Not applicable. Defendant is an individual." },
          { id: "3.7", title: "3.7 Business licensing", done: true, text: "Objection. This interrogatory seeks irrelevant information." },
        ],
      },
      {
        id: "4",
        title: "4.0 Insurance",
        children: [
          { id: "4.1", title: "4.1 Insurance policy", done: true, text: "No. Defendant holds no policy of insurance." },
          { id: "4.2", title: "4.2 Self-insurance" },
          { id: "4.3", title: "4.3 Other coverage" },
        ],
      },
    ],
  },
  { id: "verify", title: "Verification" },
];

function leaves(n: Node): Node[] {
  return n.children ? n.children.flatMap(leaves) : [n];
}

/** Progress drawn as a half-filled circle, the way it was before the counter. */
function Circle({ share }: { share: number }) {
  return (
    <span
      className={outline.circle}
      style={{ "--share": `${share * 360}deg` } as React.CSSProperties}
      aria-label={`${Math.round(share * 100)}% done`}
    />
  );
}

export function OutlineView() {
  const [dark, setDark] = useState(false);
  const [counter, setCounter] = useState(true);
  const [open, setOpen] = useState<Record<string, boolean>>({ form: true, "3": true, "4": true });
  const [selected, setSelected] = useState("4.1");
  const docRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // Bring the picked section into view inside the page, without scrolling the site. Skipped on first render.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const doc = docRef.current;
    const el = doc?.querySelector<HTMLElement>(`[data-id="${selected}"]`);
    if (!doc || !el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    doc.scrollTo({ top: el.offsetTop - 24, behavior: still ? "auto" : "smooth" });
  }, [selected]);

  function row(n: Node, depth: number) {
    const kids = n.children;
    const all = leaves(n);
    const doneCount = all.filter((l) => l.done).length;
    const isOpen = open[n.id];
    return (
      <li key={n.id} className={outline.item} style={{ "--depth": depth } as React.CSSProperties}>
        <div className={outline.row} data-selected={selected === n.id || undefined}>
          {kids ? (
            <button
              type="button"
              className={outline.chevron}
              aria-expanded={isOpen}
              aria-label={`${isOpen ? "Collapse" : "Expand"} ${n.title}`}
              onClick={() => setOpen((o) => ({ ...o, [n.id]: !o[n.id] }))}
            >
              ›
            </button>
          ) : (
            <span className={outline.dot} data-done={n.done || undefined} aria-hidden="true" />
          )}
          <button type="button" className={outline.name} onClick={() => setSelected(n.id)}>
            {n.title}
          </button>
          {kids &&
            (counter ? (
              <span className={outline.count}>
                {doneCount} of {all.length}
              </span>
            ) : (
              <Circle share={doneCount / all.length} />
            ))}
        </div>
        {kids && isOpen && <ul className={outline.children}>{kids.map((k) => row(k, depth + 1))}</ul>}
      </li>
    );
  }

  const flat = TREE.flatMap(leaves);

  return (
    <figure className={demo.demo}>
      <div className={styles.app} data-dark={dark || undefined} aria-label="The Sidecar outline beside a Word document">
        <WordChrome title="Response to Form Interrogatories.docx" />

        <div className={styles.doc} ref={docRef}>
          <p className={styles.caption}>DEFENDANT&apos;S RESPONSE TO FORM INTERROGATORIES, SET ONE</p>
          {flat.map((l) => (
            <p key={l.id} data-id={l.id} className={styles.para} data-current={selected === l.id || undefined} data-open>
              <b>{l.title}:</b>{" "}
              {l.text ? (
                <span>{l.text}</span>
              ) : (
                <span className={outline.todo}>[Not drafted yet]</span>
              )}
            </p>
          ))}
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
          <div className={styles.review}>
            <p className={styles.label}>Document outline</p>
            <ul className={outline.tree}>{TREE.map((n) => row(n, 0))}</ul>
          </div>
        </div>
      </div>

      <div className={demo.controls}>
        <span className={demo.toggle} role="group" aria-label="Word theme">
          <button type="button" aria-pressed={!dark} onClick={() => setDark(false)}>
            Light
          </button>
          <button type="button" aria-pressed={dark} onClick={() => setDark(true)}>
            Dark
          </button>
        </span>
        <span className={demo.toggle} role="group" aria-label="Progress shown as">
          <button type="button" aria-pressed={counter} onClick={() => setCounter(true)}>
            Counter
          </button>
          <button type="button" aria-pressed={!counter} onClick={() => setCounter(false)}>
            Circle
          </button>
        </span>
      </div>
      <figcaption className={demo.caption}>
        The outline nests like Word&apos;s, with lines for each level. Switch Word to dark, or compare the counter
        with the circle it replaced.
      </figcaption>
    </figure>
  );
}
