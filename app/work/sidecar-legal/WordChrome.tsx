import styles from "./review.module.css";

/**
 * Word's blue title bar, ribbon tabs and Home controls, for looks only. Shared by the Sidecar demos so each
 * one reads as the add-in docked in Word. It fills the top two rows of a `styles.app` grid.
 */
export function WordChrome({ title }: { title: string }) {
  return (
    <>
      <div className={styles.word} aria-hidden="true">
        <span className={styles.lights}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.file}>{title}</span>
        <span className={styles.ribbon}>
          <span data-on>Home</span>
          <span>Insert</span>
          <span>Layout</span>
          <span>References</span>
          <span>Review</span>
          <span>View</span>
        </span>
      </div>
      <div className={styles.tools} aria-hidden="true">
        <span className={styles.select}>Times New Roman</span>
        <span className={styles.select}>12</span>
        <span className={styles.sep} />
        <b>B</b>
        <i>I</i>
        <u>U</u>
        <span className={styles.sep} />
        <span className={styles.align}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.align} data-center>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.sep} />
        <span className={styles.style}>Normal</span>
        <span className={styles.style}>Heading 1</span>
      </div>
    </>
  );
}
