"use client";

import styles from "./cv.module.css";

/** Opens the browser's print dialog, where the CV can be printed or saved as a PDF. */
export function PrintButton() {
  return (
    <button type="button" className={styles.print} onClick={() => window.print()}>
      Save as PDF
    </button>
  );
}
