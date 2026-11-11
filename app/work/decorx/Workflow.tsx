import styles from "./demos.module.css";

/**
 * How every change moves through DecorX, from ticket to release, in the home page's
 * table-of-contents style. Numbers counted on origin/main, 27 Oct 2026; recount before publishing.
 */
const STEPS: { step: string; detail: React.ReactNode }[] = [
  { step: "Ticket", detail: "in Linear" },
  { step: "Spec", detail: "36 design docs" },
  { step: "Build", detail: "the team or an agent" },
  { step: "Review", detail: "80 of 83 pull requests" },
  { step: "CI", detail: "280 test files" },
  {
    step: "Ship",
    detail: (
      <a href="https://docs.decorx.com/changelog" target="_blank" rel="noopener noreferrer">
        12 releases
      </a>
    ),
  },
];

export function Workflow() {
  return (
    <ol className={styles.flow}>
      {STEPS.map(({ step, detail }) => (
        <li key={step}>
          <span className={styles.flowStep}>{step}</span>
          <span className={styles.flowLeader} aria-hidden="true" />
          <span className={styles.flowDetail}>{detail}</span>
        </li>
      ))}
    </ol>
  );
}

/**
 * The plans he wrote for DecorX, by title and month only: the contents are DecorX's. Dates from Google Drive
 * (Portal priorities created 4 May 2026, the High Point plan 2 Jul 2026) and from Slack, where he posted the
 * workflow docs to Mark on 23 Jun, the Q3 priorities on 2 Jul, the showroom app spec on 26 Sep and the team
 * split proposal on 22 Oct 2026 (Case Study Evidence.md, DecorX).
 */
const PLANS: [string, string][] = [
  ["Portal priorities", "May 2026"],
  ["Engineering workflow", "June"],
  ["Q3 priorities", "July"],
  ["High Point Market plan", "July"],
  ["Showroom app spec", "September"],
  ["Team split proposal", "October"],
];

export function Plans() {
  return (
    <ol className={styles.flow}>
      {PLANS.map(([plan, when]) => (
        <li key={plan}>
          <span className={styles.flowStep}>{plan}</span>
          <span className={styles.flowLeader} aria-hidden="true" />
          <span className={styles.flowDetail}>{when}</span>
        </li>
      ))}
    </ol>
  );
}
