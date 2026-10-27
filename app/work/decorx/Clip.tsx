"use client";

import demo from "../../notes/demos/demos.module.css";
import { useAutoplay } from "../../notes/demos/useAutoplay";
import styles from "./demos.module.css";

/**
 * A short, silent recording that loops while it's on screen, like the recordings in my notes.
 * Tap to pause; under reduced motion it waits for a tap.
 */
export function Clip({
  name,
  caption,
  ratio = "16 / 9",
  dir = "decorx",
}: {
  name: string;
  caption: string;
  ratio?: string;
  /** The case study folder under public/work the recording lives in. */
  dir?: string;
}) {
  const { video, playing, toggle } = useAutoplay();

  return (
    <figure className={demo.demo}>
      <button
        type="button"
        className={styles.clip}
        style={{ aspectRatio: ratio }}
        onClick={toggle}
        aria-label={playing ? "Pause the recording" : "Play the recording"}
      >
        <video
          ref={video}
          src={`/work/${dir}/${name}.mp4`}
          poster={`/work/${dir}/${name}.jpg`}
          muted
          loop
          playsInline
          preload="metadata"
        />
        {!playing && <span className={styles.play}>Play</span>}
      </button>
      <figcaption className={demo.caption}>{caption}</figcaption>
    </figure>
  );
}
