import demo from "../../notes/demos/demos.module.css";
import styles from "./demos.module.css";

export type Shot = { src: string; width: number; height: number; alt: string; label: string };

/** Several stills at once, a short label under each: two columns, one on a phone. */
export function EditGrid({ shots, caption }: { shots: Shot[]; caption: string }) {
  return (
    <figure className={demo.demo}>
      <div className={styles.grid}>
        {shots.map((s) => (
          <div key={s.src}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
            <img src={`/work/decorx/${s.src}`} alt={s.alt} width={s.width} height={s.height} loading="lazy" />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
      <figcaption className={demo.caption}>{caption}</figcaption>
    </figure>
  );
}
