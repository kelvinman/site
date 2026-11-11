import demo from "../../notes/demos/demos.module.css";
import styles from "./objects.module.css";

/**
 * The object map from his first draft walkthrough (9 May 2025), simplified: what belongs to the lawyer and
 * what belongs to a case. A case has zero or more case files; templates and past responses sit outside any
 * case, so they can start a draft in any of them.
 */
export function ObjectMap() {
  return (
    <figure className={demo.demo}>
      <div className={styles.map}>
        <div className={styles.group}>
          <p className={styles.owner}>Belongs to the lawyer</p>
          <span className={styles.object}>Templates</span>
          <span className={styles.object}>Past responses</span>
        </div>

        <div className={styles.link} aria-hidden="true">
          <span>start a draft in</span>
          <svg className={styles.across} viewBox="0 0 40 10">
            <path d="M0 5 H38 M33 1 L38 5 L33 9" />
          </svg>
          <svg className={styles.down} viewBox="0 0 10 28">
            <path d="M5 0 V26 M1 21 L5 26 L9 21" />
          </svg>
        </div>

        <div className={styles.group}>
          <p className={styles.owner}>Belongs to a case</p>
          <span className={styles.object}>
            Case files <em>0 or more</em>
          </span>
          <span className={styles.object}>Drafts</span>
        </div>
      </div>
      <figcaption className={demo.caption}>
        The product&apos;s objects, simplified from the map I made for the first draft.
      </figcaption>
    </figure>
  );
}
