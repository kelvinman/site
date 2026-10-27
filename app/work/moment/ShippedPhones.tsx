import demo from "../../notes/demos/demos.module.css";
import styles from "./moment.module.css";

/** Where each control sits on the screenshot, in percent, which side its note goes, and what it does. */
const PARTS = [
  { x: 61.7, y: 3.7, side: "right", name: "Sound", text: "Off until turned on." },
  { x: 76, y: 77.6, side: "right", name: "Joystick", text: "Moves your avatar." },
  { x: 15.7, y: 82, side: "left", name: "Run", text: "Walk or run." },
  { x: 40, y: 95.9, side: "left", name: "Chat", text: "Talks to everyone here." },
] as const;

/** The 3D space on mobile web, from a screenshot of jessiivee.world.co in 2023, cropped to the app itself. */
export function ShippedPhones() {
  return (
    <figure className={demo.demo}>
      <div className={styles.anatomy}>
        <div className={styles.anatomyShot}>
          <div className={styles.anatomyScreen}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
            <img
              src="/work/moment/world-mobile.webp"
              alt="Jessii Vee World on a phone: the 3D space with a joystick, a run button and a chat bar"
              width={750}
              height={1272}
              loading="lazy"
            />
            {PARTS.map((part, i) => (
              <span
                key={part.name}
                className={styles.callout}
                data-side={part.side}
                style={
                  part.side === "right"
                    ? { top: `${part.y}%`, left: `${part.x}%` }
                    : { top: `${part.y}%`, right: `${100 - part.x}%` }
                }
              >
                <span className={styles.dot}>{i + 1}</span>
                <span className={styles.leader} aria-hidden="true" />
                <span className={styles.note} aria-hidden="true">
                  <span className={styles.anatomyName}>{part.name}</span>
                  <span className={styles.anatomyText}>{part.text}</span>
                </span>
              </span>
            ))}
          </div>
        </div>
        <ol className={styles.anatomyList}>
          {PARTS.map((part, i) => (
            <li key={part.name}>
              <span className={styles.dot}>{i + 1}</span>
              <span>
                <span className={styles.anatomyName}>{part.name}</span>
                <span className={styles.anatomyText}>{part.text}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className={demo.caption}>Jessii Vee World on a phone, from the live product.</figcaption>
    </figure>
  );
}
