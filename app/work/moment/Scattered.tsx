import demo from "../../notes/demos/demos.module.css";
import styles from "./moment.module.css";

const PLACES = [
  { name: "Discord", what: "chat" },
  { name: "Reddit", what: "posts" },
  { name: "Roblox", what: "hanging out" },
  { name: "Own site", what: "merch" },
];

/** A creator's community before Worlds: four places, none of them the creator's. */
export function Scattered() {
  return (
    <figure className={demo.demo}>
      <div className={styles.scatter} role="img" aria-label="Chat on Discord, posts on Reddit, hanging out on Roblox and merch on a creator's own site, brought into one World">
        <div className={styles.places}>
          {PLACES.map((place) => (
            <span key={place.name} className={styles.place}>
              <strong>{place.name}</strong>
              <span>{place.what}</span>
            </span>
          ))}
        </div>
        <span className={styles.arrow} aria-hidden="true">
          ↓
        </span>
        <span className={styles.home}>
          <strong>One World</strong>
          <span>chat, board, 3D space, live events and a shop, with one identity</span>
        </span>
      </div>
      <figcaption className={demo.caption}>Before Worlds, a community was split across four places. Worlds put it in one.</figcaption>
    </figure>
  );
}
