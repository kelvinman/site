"use client";

import demo from "./demos.module.css";
import styles from "./phone.module.css";
import { useAutoplay } from "./useAutoplay";

// The frame is laid out in real iPhone 17 Pro points, then drawn at this scale.
const SCALE = 0.6;
const DEVICE = { width: 424, height: 896 };

/**
 * mymind.com in Safari on iOS 26, recorded in the iPhone 17 Pro simulator and played inside
 * a drawn iPhone. It plays while it's on screen, and waits for a tap under reduced motion.
 */
export function SafariPhone() {
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
              src="/notes/mymind-safari.mp4"
              poster="/notes/mymind-safari.jpg"
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
        mymind.com in Safari on iOS 26. At the top of the page the status bar is solid. Once it scrolls, the page shows
        through both bars.
      </figcaption>
    </figure>
  );
}
