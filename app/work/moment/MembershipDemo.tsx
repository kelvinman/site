"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./moment.module.css";

/**
 * What membership opened in Kurtis Conner World: a members-only event, members-only merch, and a
 * Member badge in the World's chat. The locked side follows the March 2023 membership designs
 * (archive, "Frame 8648"): the event's lock and Join button, the blurred shirt behind a Members
 * Only button, the badges beside names in chat. The open side is rebuilt to show what a member
 * got. Drawn in the product's own light look, whatever the page's theme.
 */
type Side = "fan" | "member";

function Lock() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.lock}>
      <rect x="3" y="7" width="10" height="7.5" rx="1.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const CHAT = [
  { color: "#9fd8c9", width: 72, member: false },
  { color: "#b3c3f2", width: 48, member: true },
  { color: "#f2c58f", width: 80, member: false },
  { color: "#d4b5ef", width: 56, member: true },
];

export function MembershipDemo() {
  const [side, setSide] = useState<Side>("fan");
  const member = side === "member";

  return (
    <figure className={demo.demo}>
      <div className={styles.product} data-member={member || undefined}>
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <b>Kurtis Conner LIVE</b>
            <span>March 5 at 4PM PST</span>
          </div>
          <div className={styles.liveArt}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
            <img src="/work/moment/member-live.webp" alt="" width={480} height={298} loading="lazy" />
            <span className={styles.badge}>
              Member <Lock />
            </span>
          </div>
          {member ? (
            <div className={styles.gate}>
              <b>You&apos;re a member</b>
              <span>This event is open to you.</span>
            </div>
          ) : (
            <div className={styles.gate}>
              <Lock />
              <b>Members Only</b>
              <span>Become a member of this world to access this event.</span>
              <span className={styles.button}>Join</span>
            </div>
          )}
        </div>

        <div className={styles.cardRow}>
          <div className={styles.card}>
            <div className={styles.tee} data-open={member || undefined}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
              <img src="/work/moment/member-tee.webp" alt="" width={360} height={337} loading="lazy" />
            </div>
            {member ? (
              <span className={styles.merchName}>Unisex T-Shirt, Signed</span>
            ) : (
              <span className={styles.button}>
                Members Only <Lock />
              </span>
            )}
          </div>

          <div className={styles.card}>
            <div className={styles.chatHead}>World Chat</div>
            <ul className={styles.chat}>
              {CHAT.map((row, i) => (
                <li key={i}>
                  <i style={{ background: row.color }} />
                  <span className={styles.bar} style={{ width: row.width }} />
                  {row.member && <span className={styles.memberTag}>Member</span>}
                </li>
              ))}
              {member && (
                <li className={styles.you}>
                  <i style={{ background: "#f4a3a3" }} />
                  <span className={styles.youName}>you</span>
                  <span className={styles.memberTag}>Member</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className={demo.toggle} role="group" aria-label="Membership">
        <button type="button" aria-pressed={!member} onClick={() => setSide("fan")}>
          Fan
        </button>
        <button type="button" aria-pressed={member} onClick={() => setSide("member")}>
          Member
        </button>
      </div>

      <figcaption className={demo.caption} aria-live="polite">
        {member
          ? "As a member: the event opens, the shirt shows, and a Member badge sits by your name in chat."
          : "As a fan: the event and the shirt stay locked, and the Member badges in chat show who has joined."}{" "}
        The locked side follows our designs for Kurtis Conner World. The open side is rebuilt to show what a member
        got.
      </figcaption>
    </figure>
  );
}
