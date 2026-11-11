"use client";

import { useEffect, useRef, useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./wethos.module.css";

/**
 * The Wethos invoice builder, rebuilt from its Figma file (Scope-to-Invoice, page "Invoice Builder
 * (Final Copy)", frames "Invoice Items", "Scope panel" and "Scope selection", read 11 Nov 2026): an
 * invoice with a button to add services from the project's scope, which opens the scope as a panel
 * over the invoice, as it does in the file. The scope rows are the same service rows as the
 * template demo above, which is the point: Bo Schlagel's note of 28 Sep 2021 in my hype doc says
 * the service and phase components I made went into the invoice builder. The phases, services and
 * prices are the design file's sample data, and the project name is the one on the scope builder
 * screen higher up the page. "Audit website" starts as already invoiced, as in the file.
 */
const PHASES: { name: string; services: { name: string; price: number; invoiced?: boolean }[] }[] = [
  {
    name: "Discovery",
    services: [
      { name: "Audit website", price: 4200, invoiced: true },
      { name: "Audit competitors", price: 4200 },
      { name: "Recommend board structure", price: 1200 },
    ],
  },
  {
    name: "Implementation",
    services: [
      { name: "Reformat images", price: 3300 },
      { name: "Design data visualizations", price: 1700 },
      { name: "Establish unique value propositions", price: 2100 },
    ],
  },
];

const money = (n: number) => `$${n.toLocaleString("en-US")}.00`;
const short = (n: number) => `$${n.toLocaleString("en-US")}`;

export function InvoiceDemo() {
  // Services added to this invoice, keyed "phase-service", in the order they were added.
  const [added, setAdded] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const panelTitle = useRef<HTMLSpanElement>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const opened = useRef(false);

  // Focus moves into the panel when it opens and back to the add button when it closes.
  useEffect(() => {
    if (open) {
      opened.current = true;
      panelTitle.current?.focus();
    } else if (opened.current) {
      addButton.current?.focus();
    }
  }, [open]);

  const toggle = (key: string) =>
    setAdded((current) => (current.includes(key) ? current.filter((k) => k !== key) : [...current, key]));

  const lines = added.map((key) => {
    const [p, i] = key.split("-").map(Number);
    return { key, phase: PHASES[p].name, ...PHASES[p].services[i] };
  });
  const total = lines.reduce((sum, l) => sum + l.price, 0);

  return (
    <figure className={demo.demo}>
      <div className={styles.invoiceDemo}>
        <div className={styles.sheet} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
          <div className={styles.sheetBody} inert={open || undefined}>
            <div className={styles.sheetHead}>
              <span className={styles.sheetTitle}>Invoice</span>
              <span className={styles.sheetNumber}>No. 0004</span>
            </div>

            <dl className={styles.sheetMeta}>
              <div>
                <dt>Project</dt>
                <dd>Fabulous Wow Website, RPDR</dd>
              </div>
              <div>
                <dt>Issued</dt>
                <dd>Sep 28, 2021</dd>
              </div>
              <div>
                <dt>Due</dt>
                <dd>Oct 28, 2021</dd>
              </div>
            </dl>

            <table className={styles.lines}>
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.key} className={styles.line}>
                    <td>
                      {l.name}
                      <span>{l.phase}</span>
                    </td>
                    <td>{money(l.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button ref={addButton} type="button" className={styles.addFromScope} onClick={() => setOpen(true)}>
              + Add services from scope
            </button>

            <div className={styles.totals}>
              <div>
                <span>Subtotal</span>
                <span>{money(total)}</span>
              </div>
              <div className={styles.due}>
                <span>Total due</span>
                <span aria-live="polite">{money(total)}</span>
              </div>
            </div>
          </div>

          <div
            className={styles.scopePanel}
            data-open={open || undefined}
            role="dialog"
            aria-label="Services in your scope"
            inert={!open || undefined}
          >
            <div className={styles.panelHead}>
              <span ref={panelTitle} tabIndex={-1}>
                Services in your scope
              </span>
              <button type="button" onClick={() => setOpen(false)}>
                Done
              </button>
            </div>

            {PHASES.map((phase, p) => (
              <div key={phase.name}>
                <div className={styles.phase}>
                  <span>{phase.name}</span>
                  <span>{short(phase.services.reduce((s, svc) => s + svc.price, 0))}</span>
                </div>
                <ul className={`${styles.services} ${styles.picker}`}>
                  {phase.services.map((s, i) => {
                    const key = `${p}-${i}`;
                    if (s.invoiced) {
                      return (
                        <li key={key}>
                          <div className={`${styles.service} ${styles.done}`}>
                            <span className={styles.check} aria-hidden="true" />
                            <span className={styles.name}>{s.name}</span>
                            <span className={styles.chip}>invoiced</span>
                            <span className={styles.price}>{short(s.price)}</span>
                          </div>
                        </li>
                      );
                    }
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          className={styles.service}
                          aria-pressed={added.includes(key)}
                          onClick={() => toggle(key)}
                        >
                          <span className={styles.check} aria-hidden="true" />
                          <span className={styles.name}>{s.name}</span>
                          <span className={styles.unit} />
                          <span className={styles.price}>{short(s.price)}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <figcaption className={demo.caption}>
        The invoice builder, rebuilt from its design file. Add services from the project&apos;s scope to bill for
        them. A service already invoiced is marked, so it isn&apos;t billed twice. The services and prices are the
        file&apos;s sample data.
      </figcaption>
    </figure>
  );
}
