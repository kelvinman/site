"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./moment.module.css";
import { StatusIcons } from "./ShippedPhones";

/** A capture with its own status bar cut off, `tone` saying whether the bar drawn over it should
 *  be white on black (dark) or black on white (light). */
export type PhoneScreen = {
  key: string;
  label: string;
  src: string;
  height: number;
  tone?: "dark" | "light";
  alt: string;
  caption: string;
};

/**
 * Real phone captures in the iPhone frame the other Moment screens use, one at a time, picked by a
 * toggle under the phone. Each capture is 540 wide with its status bar cut off; the status bar and
 * notch are drawn in CSS, the same as on the 3D space phone, so every screen sits at the same
 * height whatever phone it was captured on. `note` stays the same under every screen.
 */
export function PhoneScreens({ screens, label, note }: { screens: PhoneScreen[]; label: string; note?: string }) {
  const [active, setActive] = useState(screens[0].key);
  const current = screens.find((s) => s.key === active) ?? screens[0];

  return (
    <figure className={demo.demo}>
      <div className={styles.anatomyShot}>
        <div className={styles.glass} data-tone={current.tone ?? "dark"}>
          <div className={styles.statusBar} aria-hidden="true">
            <span>9:41</span>
            <StatusIcons />
          </div>
          <span className={styles.notch} aria-hidden="true" />
          <div className={styles.shots}>
            {screens.map((s) => (
              // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
              <img
                key={s.key}
                src={s.src}
                alt={s.key === active ? s.alt : ""}
                width={540}
                height={s.height}
                loading="lazy"
                className={styles.screen}
                data-active={s.key === active || undefined}
              />
            ))}
          </div>
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
