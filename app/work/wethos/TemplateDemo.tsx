"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./wethos.module.css";

/**
 * A Wethos template you can edit: the Branding template from Wethos's public library
 * (teams.wethos.co/templates/1181, read 6 Nov 2026), with its four phases and the services in each,
 * named as Wethos names them. Taking a service out or putting it back updates the phase and the
 * overall price, which is how templates work in the product. Wethos keeps its recommended prices
 * for paid plans, so the prices here are made up, and the caption says so.
 */
const PHASES: { name: string; services: { name: string; unit: string; price: number }[] }[] = [
  {
    name: "Discovery",
    services: [
      { name: "Build interview guides for listening tours", unit: "1 guide", price: 800 },
      { name: "Conduct listening tours", unit: "1 tour", price: 2400 },
      { name: "Audit competitors", unit: "1 report", price: 1200 },
    ],
  },
  {
    name: "Strategy",
    services: [
      { name: "Research audience personas", unit: "1 report", price: 2000 },
      { name: "Build audience personas", unit: "1 persona", price: 900 },
      { name: "Establish unique value propositions", unit: "1 value proposition", price: 700 },
      { name: "Establish brand mission statements", unit: "1 statement", price: 600 },
      { name: "Develop a brand's tone of voice", unit: "1 guide", price: 900 },
      { name: "Assemble mood board", unit: "1 mood board", price: 600 },
    ],
  },
  {
    name: "Execution",
    services: [
      { name: "Write taglines", unit: "1 tagline", price: 600 },
      { name: "Develop color palettes", unit: "1 palette", price: 700 },
      { name: "Design logos", unit: "1 logo", price: 3500 },
      { name: "Source images", unit: "1 image", price: 300 },
      { name: "Design typefaces", unit: "1 typeface", price: 4000 },
      { name: "Design business card templates", unit: "1 template", price: 400 },
      { name: "Design letterhead templates", unit: "1 template", price: 300 },
      { name: "Design business presentation templates", unit: "1 template", price: 900 },
    ],
  },
  {
    name: "Hand-off",
    services: [{ name: "Create branding style guides", unit: "1 guide", price: 1800 }],
  },
];

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export function TemplateDemo() {
  const [phase, setPhase] = useState(0);
  // Which services are in, keyed "phase-service". Every service starts in, as a template does.
  const [out, setOut] = useState<Set<string>>(new Set());

  const toggle = (key: string) =>
    setOut((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const subtotal = (p: number) =>
    PHASES[p].services.reduce((sum, s, i) => sum + (out.has(`${p}-${i}`) ? 0 : s.price), 0);
  const total = PHASES.reduce((sum, _, p) => sum + subtotal(p), 0);
  const removed = out.size;

  return (
    <figure className={demo.demo}>
      <div className={styles.template}>
        <div className={styles.head}>
          <span className={styles.title}>Branding</span>
          <span className={styles.total} aria-live="polite">
            {money(total)}
          </span>
        </div>

        <ul className={styles.services}>
          {PHASES[phase].services.map((s, i) => {
            const key = `${phase}-${i}`;
            const included = !out.has(key);
            return (
              <li key={key}>
                <button type="button" className={styles.service} aria-pressed={included} onClick={() => toggle(key)}>
                  <span className={styles.check} aria-hidden="true" />
                  <span className={styles.name}>{s.name}</span>
                  <span className={styles.unit}>{s.unit}</span>
                  <span className={styles.price}>{money(s.price)}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className={styles.foot}>
          <span>{PHASES[phase].name}</span>
          <span>{money(subtotal(phase))}</span>
        </div>
      </div>

      <div className={demo.toggle} role="group" aria-label="Phases">
        {PHASES.map((p, i) => (
          <button key={p.name} type="button" aria-pressed={phase === i} onClick={() => setPhase(i)}>
            {p.name}
          </button>
        ))}
      </div>

      <figcaption className={demo.caption}>
        {removed === 0
          ? "Wethos's Branding template, with its real phases and services. Take a service out and the price updates. The prices are made up; Wethos keeps its own for paid plans."
          : `${removed} ${removed === 1 ? "service" : "services"} taken out, and the price follows. The prices are made up; the phases and services are Wethos's.`}
      </figcaption>
    </figure>
  );
}
