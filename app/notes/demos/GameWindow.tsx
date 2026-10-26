"use client";

import { useState } from "react";
import styles from "./demos.module.css";
import { useAutoplay } from "./useAutoplay";

const GAME = "https://kelvinman.github.io/the-last-apostate/";

/**
 * The game playing itself, as a short recording of its canvas. "Play it here" swaps in the
 * real game, so nothing heavy loads until someone asks for it.
 */
export function GameWindow() {
  const [live, setLive] = useState(false);
  const { video, playing, toggle } = useAutoplay();

  return (
    <figure className={styles.demo}>
      <div className={styles.window}>
        {live ? (
          <iframe src={`${GAME}?installation`} title="The Last Apostate, playing its cycle" allow="fullscreen; autoplay" />
        ) : (
          <button type="button" className={styles.screenButton} onClick={toggle} aria-label={playing ? "Pause the recording" : "Play the recording"}>
            <video
              ref={video}
              src="/notes/the-last-apostate-cycle.mp4"
              poster="/notes/the-last-apostate-cycle.jpg"
              muted
              loop
              playsInline
              preload="metadata"
            />
          </button>
        )}
      </div>
      <figcaption className={styles.caption}>
        {live ? (
          <>
            Click inside and press any key to take over the run.{" "}
            <button type="button" className={styles.textButton} onClick={() => setLive(false)}>
              Back to the recording
            </button>
          </>
        ) : (
          <>
            When nobody is playing, the game plays itself. Freed followers stay to watch from the walls.{" "}
            <button type="button" className={styles.textButton} onClick={() => setLive(true)}>
              Play it here
            </button>{" "}
            or{" "}
            <a href={GAME} target="_blank" rel="noopener noreferrer">
              full screen
            </a>
            .
          </>
        )}
      </figcaption>
    </figure>
  );
}
