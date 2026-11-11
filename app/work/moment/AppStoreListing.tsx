import demo from "../../notes/demos/demos.module.css";
import styles from "./moment.module.css";

/**
 * The Worlds app as its App Store page showed it on an iPhone: the icon, the name and the Get button,
 * then the screenshots in a row that scrolls sideways. The listing is gone, so only what is certain
 * is drawn: the name from Apple's approval email, the icon from the Smart App Banner design, and the
 * three screenshots exported for the page. Drawn in the App Store's own light look.
 */
const SHOTS = [
  { key: "board", src: "/work/moment/appstore-board.webp", alt: "Board: Discuss and vote on your favorite topics." },
  { key: "chats", src: "/work/moment/appstore-chats.webp", alt: "Chats: Talk and meet with people all over the globe." },
  { key: "space", src: "/work/moment/appstore-space.webp", alt: "Space: Explore and play with your own avatar." },
];

export function AppStoreListing() {
  return (
    <figure className={demo.demo}>
      <div className={styles.store}>
        <div className={styles.storeHead}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
          <img src="/work/moment/worlds-icon.webp" alt="" width={204} height={204} className={styles.storeIcon} />
          <div className={styles.storeName}>
            <b>Worlds</b>
            <span className={styles.storeGet}>Get</span>
          </div>
        </div>
        <div className={styles.storeRule} />
        <div className={styles.storeShots} tabIndex={0} aria-label="Screenshots">
          {SHOTS.map((s) => (
            // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
            <img key={s.key} src={s.src} alt={s.alt} width={645} height={1398} loading="lazy" />
          ))}
        </div>
        <div className={styles.storeDevice}>
          <svg viewBox="0 0 10 16" aria-hidden="true">
            <rect x="1" y="1" width="8" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          iPhone
        </div>
      </div>
      <figcaption className={demo.caption}>
        The App Store page, rebuilt with the app&apos;s real icon and screenshots. Scroll sideways for the rest.
      </figcaption>
    </figure>
  );
}
