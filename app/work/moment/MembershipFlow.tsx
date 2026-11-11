"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./moment.module.css";

/** The membership flow on desktop, from the Membership file in Figma (page V13, the sections marked
 *  done, May 2023): a members-only channel locked, the tiers, the confirmation, and the same channel
 *  open. Each frame is 1512 by 982, exported at 1x. */
const STEPS = [
  { key: "locked", label: "Locked", caption: "A members-only channel, Drops, locked for a fan who hasn't joined." },
  { key: "choose", label: "Choose a tier", caption: "Three tiers, billed monthly or yearly, with what each one adds." },
  { key: "confirmed", label: "Confirmed", caption: "The confirmation, with a membership card that shows the plan and the date joined." },
  { key: "memberchat", label: "Member", caption: "The same channel, open to a member." },
];

export function MembershipFlow() {
  const [active, setActive] = useState(STEPS[0].key);
  const current = STEPS.find((s) => s.key === active) ?? STEPS[0];

  return (
    <figure className={demo.demo}>
      <div className={styles.desktop}>
        {STEPS.map((s) => (
          // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
          <img
            key={s.key}
            src={`/work/moment/member-${s.key}.webp`}
            alt={s.key === active ? `Membership: ${s.label}` : ""}
            width={1512}
            height={982}
            loading="lazy"
            className={styles.screen}
            data-active={s.key === active || undefined}
          />
        ))}
      </div>

      <div className={demo.toggle} role="group" aria-label="Membership steps">
        {STEPS.map((s) => (
          <button key={s.key} type="button" aria-pressed={s.key === active} onClick={() => setActive(s.key)}>
            {s.label}
          </button>
        ))}
      </div>

      <figcaption className={demo.caption} aria-live="polite">
        {current.caption} From the last version of the membership designs, May 2023.
      </figcaption>
    </figure>
  );
}
