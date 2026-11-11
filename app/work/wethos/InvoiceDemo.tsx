"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./wethos.module.css";

/**
 * The Wethos invoice builder's first step, picking services from the project's scope, rebuilt from
 * its Figma file (Scope-to-Invoice, page "Invoice Builder (Final Copy)", frames "Scope selection"
 * and "Invoice Items", read 11 Nov 2026). The rows are the same service rows as the template demo
 * above it, which is the point: Bo Schlagel's note of 28 Sep 2021 in my hype doc says the service
 * and phase components I made went into the invoice builder. The phases, services and prices are
 * the design file's sample data; "Audit website" starts as already invoiced, as it does there.
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

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export function InvoiceDemo() {
  // Services added to this invoice, keyed "phase-service".
  const [added, setAdded] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setAdded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const total = PHASES.reduce(
    (sum, phase, p) => sum + phase.services.reduce((s, svc, i) => s + (added.has(`${p}-${i}`) ? svc.price : 0), 0),
    0,
  );
  const count = added.size;

  return (
    <figure className={demo.demo}>
      <div className={`${styles.template} ${styles.picker}`}>
        <div className={styles.head}>
          <span className={styles.title}>New invoice</span>
          <span className={styles.total} aria-live="polite">
            {money(total)}
          </span>
        </div>

        {PHASES.map((phase, p) => (
          <div key={phase.name}>
            <div className={styles.phase}>
              <span>{phase.name}</span>
              <span>{money(phase.services.reduce((s, svc) => s + svc.price, 0))}</span>
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
                        <span className={styles.price}>{money(s.price)}</span>
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={key}>
                    <button
                      type="button"
                      className={styles.service}
                      aria-pressed={added.has(key)}
                      onClick={() => toggle(key)}
                    >
                      <span className={styles.check} aria-hidden="true" />
                      <span className={styles.name}>{s.name}</span>
                      <span className={styles.unit} />
                      <span className={styles.price}>{money(s.price)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className={styles.foot}>
          <span>
            {count === 0 ? "No services added yet" : `${count} ${count === 1 ? "service" : "services"} on this invoice`}
          </span>
          <span>{money(total)}</span>
        </div>
      </div>

      <figcaption className={demo.caption}>
        The invoice builder, rebuilt from its design file. Pick services from the project&apos;s scope to invoice
        for them. A service already invoiced is marked, so it isn&apos;t billed twice. The services and prices are
        the file&apos;s sample data.
      </figcaption>
    </figure>
  );
}
