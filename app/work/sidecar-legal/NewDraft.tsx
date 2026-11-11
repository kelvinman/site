"use client";

import { useEffect, useRef, useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./review.module.css";
import draft from "./draft.module.css";
import { WordChrome } from "./WordChrome";

/**
 * Starting a draft, from the "New Draft (Existing Case)" flow in the [OAI Legal] Welcome Screen file (V3 to V6),
 * rebuilt so it can be tried: the case first, then the template, both searchable; a save step, since the
 * document had to be saved before Sidecar could draft into it; then drafting with nothing covering Word, the
 * outline filling in item by item (his idea for progressive loading, 9 May 2025 walkthrough). Case names and
 * the drafted text are stand-ins.
 */
const CASES = ["Maple Court LLC v. Reyes", "Okafor v. Dunmore Properties", "Larkin v. City Transit", "Reyes v. Harbor Foods"];
const TEMPLATES = ["Form interrogatories, set one", "Special interrogatories", "Requests for admission", "Your past response, 2024"];

const SECTIONS = [
  { title: "Preliminary statement", text: "These responses are made solely for the purpose of this action." },
  { title: "3.6: Fictitious business name", text: "Not applicable. Defendant is an individual." },
  { title: "3.7: Business licensing", text: "Objection. This interrogatory seeks irrelevant information." },
  { title: "4.1: Insurance policy", text: "No. Defendant holds no policy of insurance." },
  { title: "Verification", text: "I declare under penalty of perjury that the foregoing is true and correct." },
];

const STEP_MS = 750;

function Search({
  label,
  options,
  value,
  onPick,
  disabled,
}: {
  label: string;
  options: string[];
  value: string | null;
  onPick: (v: string | null) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const shown = options.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  if (value) {
    return (
      <div className={draft.picked}>
        <span className={draft.tick} aria-hidden="true">
          ✓
        </span>
        <span className={draft.value}>{value}</span>
        <button type="button" className={draft.change} onClick={() => onPick(null)}>
          Change
        </button>
      </div>
    );
  }

  return (
    <div className={draft.search} data-disabled={disabled || undefined}>
      <input
        type="search"
        placeholder={`Search ${label}`}
        aria-label={`Search ${label}`}
        value={query}
        disabled={disabled}
        onChange={(e) => setQuery(e.target.value)}
      />
      {!disabled && (
        <ul>
          {shown.map((o) => (
            <li key={o}>
              <button type="button" onClick={() => onPick(o)}>
                {o}
              </button>
            </li>
          ))}
          {shown.length === 0 && <li className={draft.none}>No matches</li>}
        </ul>
      )}
    </div>
  );
}

export function NewDraft() {
  const [kase, setKase] = useState<string | null>(null);
  const [template, setTemplate] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [filled, setFilled] = useState(-1);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const drafting = filled >= 0 && filled < SECTIONS.length;
  const done = filled >= SECTIONS.length;

  function generate() {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setFilled(still ? SECTIONS.length : 0);
    if (still) return;
    for (let k = 1; k <= SECTIONS.length; k++) {
      timers.current.push(window.setTimeout(() => setFilled(k), STEP_MS * k));
    }
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setKase(null);
    setTemplate(null);
    setSaved(false);
    setFilled(-1);
  }

  const title = saved ? "Response to Form Interrogatories.docx" : "Document1";

  return (
    <figure className={demo.demo}>
      <div className={styles.app} aria-label="Starting a draft in the Sidecar add-in">
        <WordChrome title={title} />

        <div className={styles.doc}>
          {filled < 0 ? (
            <p className={draft.empty}>
              <span className={draft.caret} aria-hidden="true" />
            </p>
          ) : (
            <>
              <p className={styles.caption}>DEFENDANT&apos;S RESPONSE TO FORM INTERROGATORIES, SET ONE</p>
              {SECTIONS.slice(0, filled).map((s) => (
                <p key={s.title} className={draft.drafted}>
                  <b>{s.title}:</b> {s.text}
                </p>
              ))}
              {drafting && <p className={draft.writing} aria-hidden="true" />}
            </>
          )}
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

          {filled < 0 ? (
            <ol className={draft.steps}>
              <li data-done={kase ? true : undefined}>
                <p className={draft.ask}>Which case is this for?</p>
                <Search label="cases" options={CASES} value={kase} onPick={setKase} />
              </li>
              <li data-done={template ? true : undefined}>
                <p className={draft.ask}>Which template?</p>
                <Search label="templates" options={TEMPLATES} value={template} onPick={setTemplate} disabled={!kase} />
              </li>
              <li data-done={saved || undefined}>
                <p className={draft.ask}>Save your document</p>
                {!saved && (
                  <button
                    type="button"
                    className={draft.button}
                    disabled={!kase || !template}
                    onClick={() => setSaved(true)}
                  >
                    Save
                  </button>
                )}
              </li>
              <li>
                <p className={draft.ask}>Generate the draft</p>
                <button type="button" className={styles.accept} disabled={!saved} onClick={generate}>
                  Generate
                </button>
              </li>
            </ol>
          ) : (
            <div className={styles.review}>
              <div className={draft.status}>
                <span>{done ? "Draft ready" : "Drafting"}</span>
                <span className={styles.count}>
                  {Math.min(filled, SECTIONS.length)} of {SECTIONS.length}
                </span>
              </div>
              <p className={styles.label}>Document outline</p>
              <ul className={draft.outline}>
                {SECTIONS.map((s, i) => (
                  <li key={s.title} data-state={i < filled ? "done" : i === filled ? "now" : undefined}>
                    {s.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className={demo.controls}>
        <button type="button" className={demo.quiet} onClick={reset} disabled={!kase}>
          Start over
        </button>
      </div>
      <figcaption className={demo.caption}>
        Starting a draft, rebuilt so you can try it. Pick a case and a template, save, then generate. Sidecar drafts
        item by item and nothing covers the page. The cases are stand-ins.
      </figcaption>
    </figure>
  );
}
