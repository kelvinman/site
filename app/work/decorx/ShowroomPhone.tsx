"use client";

import demo from "../../notes/demos/demos.module.css";
import styles from "../../notes/demos/phone.module.css";
import { useAutoplay } from "../../notes/demos/useAutoplay";

// The same drawn iPhone 17 Pro as the Safari note, in real points, drawn at this scale.
const SCALE = 0.6;
const DEVICE = { width: 424, height: 896 };

/**
 * The showroom app's real onboarding, recorded in the iPhone 17 Pro simulator on 26 Oct 2026
 * against production with a test store name, in two takes, with the sign-up sheet between them cut out. The
 * waits are cut, everything shown plays at real speed, and it ends on the furniture picks, before the photoshoot.
 */
export function ShowroomPhone() {
  const { video, playing, toggle } = useAutoplay();

  return (
    <figure className={demo.demo}>
      <button
        type="button"
        className={styles.stage}
        style={{ width: DEVICE.width * SCALE, height: DEVICE.height * SCALE }}
        onClick={toggle}
        aria-label={playing ? "Pause the recording" : "Play the recording"}
      >
        <span className={styles.device} style={{ transform: `scale(${SCALE})` }}>
          <span className={`${styles.button} ${styles.action}`} />
          <span className={`${styles.button} ${styles.volumeUp}`} />
          <span className={`${styles.button} ${styles.volumeDown}`} />
          <span className={`${styles.button} ${styles.side}`} />
          <span className={styles.screen}>
            <video
              ref={video}
              src="/work/decorx/showroom-onboarding.mp4"
              poster="/work/decorx/showroom-onboarding.jpg"
              muted
              loop
              playsInline
              preload="metadata"
            />
          </span>
        </span>
        {!playing && <span className={styles.play}>Play</span>}
      </button>

      <figcaption className={demo.caption}>
        The real onboarding, with the waits cut. The test store name turned out to belong to a real store.
      </figcaption>
    </figure>
  );
}
