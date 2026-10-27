import demo from "../../notes/demos/demos.module.css";
import styles from "./demos.module.css";

/** DecorX's two products and the one platform they became, as a small diagram. */
export function TwoProducts() {
  return (
    <figure className={demo.demo}>
      <div className={styles.merge} role="img" aria-label="Canvas, for designers, and Portal, for retailers, became one platform">
        <div className={styles.pair}>
          <span className={styles.product}>
            <strong>Canvas</strong>
            <span>for interior designers</span>
          </span>
          <span className={styles.product}>
            <strong>Portal</strong>
            <span>for retailers</span>
          </span>
        </div>
        <span className={styles.arrow} aria-hidden="true">
          ↓
        </span>
        <span className={`${styles.product} ${styles.one}`}>
          <strong>One platform</strong>
          <span>one account, both audiences</span>
        </span>
      </div>
      <figcaption className={demo.caption}>Portal grew until it did both jobs, so everyone moved onto it.</figcaption>
    </figure>
  );
}
