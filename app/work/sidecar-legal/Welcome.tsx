"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./review.module.css";
import wc from "./welcome.module.css";

/**
 * The welcome screen from his 19 May 2025 Loom ("[OAI Legal] First Draft"): three ways in with Cmd+1, 2 and 3,
 * and a beginner and pro toggle. Beginner explains each option and offers a sample case and ready templates,
 * the gap he flagged for new users in his 9 May walkthrough; pro keeps only the options and their shortcuts.
 * The three option names are a reconstruction from the Loom notes, not read from the Figma file.
 */
const OPTIONS = [
  { key: "1", title: "Start a draft", text: "Draft a response for one of your cases." },
  { key: "2", title: "Create a case", text: "Add a case and its files, and Sidecar reads them." },
  { key: "3", title: "Templates", text: "Your templates and past responses, for any case." },
];

export function Welcome() {
  const [pro, setPro] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  function onKey(e: React.KeyboardEvent) {
    if (!(e.metaKey || e.ctrlKey)) return;
    const hit = OPTIONS.find((o) => o.key === e.key);
    if (hit) {
      e.preventDefault();
      setPicked(hit.key);
    }
  }

  return (
    <figure className={demo.demo}>
      <div className={wc.pane} tabIndex={0} onKeyDown={onKey} aria-label="Sidecar welcome screen">
        <div className={styles.paneHead}>
          <span className={styles.brand}>Sidecar</span>
        </div>
        <div className={wc.body}>
          <div className={wc.top}>
            <p className={wc.hello}>Welcome</p>
            <span className={wc.mode} role="group" aria-label="Experience">
              <button type="button" aria-pressed={!pro} onClick={() => setPro(false)}>
                Beginner
              </button>
              <button type="button" aria-pressed={pro} onClick={() => setPro(true)}>
                Pro
              </button>
            </span>
          </div>

          <ul className={wc.options} data-pro={pro || undefined}>
            {OPTIONS.map((o) => (
              <li key={o.key}>
                <button type="button" data-picked={picked === o.key || undefined} onClick={() => setPicked(o.key)}>
                  <span className={wc.name}>{o.title}</span>
                  {!pro && <span className={wc.text}>{o.text}</span>}
                  <kbd>⌘{o.key}</kbd>
                </button>
              </li>
            ))}
          </ul>

          {!pro && (
            <div className={wc.sample}>
              <p className={wc.sampleTitle}>New to Sidecar?</p>
              <p>Open a sample case with its files and ready templates, and draft a response in a minute.</p>
              <button type="button" className={wc.link} onClick={() => setPicked("sample")}>
                Open the sample case
              </button>
            </div>
          )}

          {picked && (
            <p className={wc.toast} key={picked}>
              {picked === "sample"
                ? "Opens a sample case, ready to draft."
                : `Opens ${OPTIONS.find((o) => o.key === picked)?.title}.`}
            </p>
          )}
        </div>
      </div>
      <figcaption className={demo.caption}>
        The welcome screen. Beginner explains each way in and offers a sample case. Pro keeps the shortcuts, ⌘1 to
        ⌘3, and nothing else.
      </figcaption>
    </figure>
  );
}
