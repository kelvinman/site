"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./wethos.module.css";

/**
 * The Wethos invoice builder, rebuilt from its Figma file (Scope-to-Invoice, page "Invoice Builder
 * (Final Copy)", frames "Scope selection" and "Invoice Items", read 11 Nov 2026): an invoice, and
 * under it the project's scope to add services from. The scope rows are the same service rows as
 * the template demo above, which is the point: Bo Schlagel's note of 28 Sep 2021 in my hype doc
 * says the service and phase components I made went into the invoice builder. The phases,
 * services and prices are the design file's sample data, and the project name is the one on the
 * scope builder screen higher up the page. "Audit website" starts as already invoiced, as in the
 * file.
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
        <div className={styles.sheet}>
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
              {lines.length === 0 ? (
                <tr className={styles.emptyLine}>
                  <td colSpan={2}>Add services from the scope below.</td>
                </tr>
              ) : (
                lines.map((l) => (
                  <tr key={l.key} className={styles.line}>
                    <td>
                      {l.name}
                      <span>{l.phase}</span>
                    </td>
                    <td>{money(l.price)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

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

        <div className={`${styles.template} ${styles.picker}`}>
          <div className={styles.head}>
            <span className={styles.title}>Services in your scope</span>
          </div>

          {PHASES.map((phase, p) => (
            <div key={phase.name}>
              <div className={styles.phase}>
                <span>{phase.name}</span>
                <span>{short(phase.services.reduce((s, svc) => s + svc.price, 0))}</span>
              </div>
              <ul className={styles.services}>
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

      <figcaption className={demo.caption}>
        The invoice builder, rebuilt from its design file. Tick services in the project&apos;s scope to bill for
        them. A service already invoiced is marked, so it isn&apos;t billed twice. The services and prices are the
        file&apos;s sample data.
      </figcaption>
    </figure>
  );
}
