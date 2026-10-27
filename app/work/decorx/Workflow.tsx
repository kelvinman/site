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
