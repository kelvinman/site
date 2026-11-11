"use client";

import { useEffect, useRef, useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./review.module.css";
import draft from "./draft.module.css";
import nc from "./newcase.module.css";
import { WordChrome } from "./WordChrome";

/**
 * Creating a case, from his 19 May 2025 Loom ("[OAI Legal] First Draft", 7:30) and the "Required/Recommended
 * File Inputs" page of the [OAI Legal] Welcome Screen file: a new case starts with the files, the add-in
 * checks them against what that kind of document needs, then Sidecar reads them and suggests the case name
 * and client type for the lawyer to confirm or change. The files, the checklist and the suggestion are
 * stand-ins.
 */
const FILES = [
  { name: "Complaint, unlawful detainer.pdf", meets: "complaint" },
  { name: "Lease agreement.pdf", meets: "lease" },
  { name: "Client intake notes.docx", meets: "notes" },
];

const NEEDS = [
  { id: "complaint", label: "The complaint", required: true },
  { id: "lease", label: "Lease or contract", required: false },
  { id: "notes", label: "Client notes", required: false },
  { id: "notice", label: "Notice to quit", required: false },
];

const SUGGESTION = { name: "Maple Court LLC v. Reyes", client: "Defendant (tenant)" };

type Phase = "files" | "reading" | "suggest" | "created";

export function NewCase() {
  const [added, setAdded] = useState(0);
  const [phase, setPhase] = useState<Phase>("files");
  const [name, setName] = useState(SUGGESTION.name);
  const [editing, setEditing] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function after(ms: number, fn: () => void) {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.push(window.setTimeout(fn, still ? 0 : ms));
  }

  function addFile() {
    setAdded((n) => Math.min(FILES.length, n + 1));
  }

  function read() {
    setPhase("reading");
    after(1400, () => setPhase("suggest"));
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setAdded(0);
    setPhase("files");
    setName(SUGGESTION.name);
    setEditing(false);
  }

  const met = new Set(FILES.slice(0, added).map((f) => f.meets));
  const requiredMet = NEEDS.filter((n) => n.required).every((n) => met.has(n.id));

  return (
    <figure className={demo.demo}>
      <div className={styles.app} aria-label="Creating a case in the Sidecar add-in">
        <WordChrome title="Document1" />

        <div className={styles.doc}>
          <p className={draft.empty}>
            <span className={draft.caret} aria-hidden="true" />
          </p>
        </div>

        <div className={styles.pane}>
          <div className={styles.paneHead}>
            <span className={styles.brand}>Sidecar</span>
            <span className={styles.tabs} aria-hidden="true">
              <span>Draft</span>
              <span>Chat</span>
              <span data-on>Case Files</span>
            </span>
          </div>

          <div className={styles.review}>
            {phase === "files" && (
              <>
                <p className={styles.title}>New case</p>
                <p className={nc.lead}>Start with the files. Sidecar reads them for you.</p>
                <button
                  type="button"
                  className={nc.drop}
                  onClick={addFile}
                  disabled={added === FILES.length}
                >
                  {added === FILES.length ? "All files added" : "Add a file"}
                </button>
                {added > 0 && (
                  <ul className={nc.files}>
                    {FILES.slice(0, added).map((f) => (
                      <li key={f.name}>{f.name}</li>
                    ))}
                  </ul>
                )}
                <p className={styles.label}>For a response to interrogatories</p>
                <ul className={nc.needs}>
                  {NEEDS.map((n) => (
                    <li key={n.id} data-met={met.has(n.id) || undefined}>
                      <span>{n.label}</span>
                      <em>{n.required ? "Required" : "Recommended"}</em>
                    </li>
                  ))}
                </ul>
                <button type="button" className={styles.accept} disabled={!requiredMet} onClick={read}>
                  Continue
                </button>
              </>
            )}

            {phase === "reading" && (
              <div className={nc.reading}>
                <span className={nc.spinner} aria-hidden="true" />
                <p>Reading {added} files…</p>
              </div>
            )}

            {phase === "suggest" && (
              <>
                <p className={styles.title}>Is this right?</p>
                <p className={nc.lead}>Sidecar suggested these from the complaint. Change anything that&apos;s off.</p>
                <p className={styles.label}>Case name</p>
                {editing ? (
                  <input
                    className={nc.input}
                    value={name}
                    aria-label="Case name"
                    autoFocus
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setEditing(false)}
                    onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
                  />
                ) : (
                  <p className={nc.field}>
                    <span>{name}</span>
                    <button type="button" className={draft.change} onClick={() => setEditing(true)}>
                      Edit
                    </button>
                  </p>
                )}
                <p className={styles.label}>Client type</p>
                <p className={nc.field}>
                  <span>{SUGGESTION.client}</span>
                </p>
                <p className={nc.from}>From: Complaint, unlawful detainer.pdf, page 1</p>
                <button type="button" className={styles.accept} onClick={() => setPhase("created")}>
                  Confirm
                </button>
              </>
            )}

            {phase === "created" && (
              <div className={styles.done}>
                <span className={styles.check} aria-hidden="true">
                  ✓
                </span>
                <p>
                  <b>{name}</b> is ready, with {added} case files.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={demo.controls}>
        <button type="button" className={demo.quiet} onClick={reset} disabled={added === 0}>
          Start over
        </button>
      </div>
      <figcaption className={demo.caption}>
        Creating a case, rebuilt so you can try it. Add files until the required ones are in, then confirm what
        Sidecar suggests. The files and the case are stand-ins.
      </figcaption>
    </figure>
  );
}
