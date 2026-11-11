"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./moment.module.css";

export type PhoneScreen = { key: string; label: string; src: string; alt: string; caption: string };

/**
 * Real phone captures in the iPhone frame the other Moment screens use, one at a time, picked
 * by a toggle under the phone. Each capture is 540 wide and fills the frame's glass. `note` is a
 * line that stays the same under every screen, such as where the captures come from.
 */
export function PhoneScreens({ screens, label, note }: { screens: PhoneScreen[]; label: string; note?: string }) {
  const [active, setActive] = useState(screens[0].key);
  const current = screens.find((s) => s.key === active) ?? screens[0];

  return (
    <figure className={demo.demo}>
      <div className={styles.anatomyShot}>
        <div className={styles.glass}>
          {screens.map((s) => (
            // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
            <img
              key={s.key}
              src={s.src}
              alt={s.key === active ? s.alt : ""}
              width={540}
              height={1169}
              loading="lazy"
              className={styles.screen}
              data-active={s.key === active || undefined}
            />
          ))}
        </div>
      </div>

      <div className={demo.toggle} role="group" aria-label={label}>
        {screens.map((s) => (
          <button key={s.key} type="button" aria-pressed={s.key === active} onClick={() => setActive(s.key)}>
            {s.label}
          </button>
        ))}
      </div>

      <figcaption className={demo.caption} aria-live="polite">
        {current.caption}
        {note ? ` ${note}` : null}
      </figcaption>
    </figure>
  );
}
