"use client";

import { useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./moment.module.css";

/**
 * The real Worlds screens from the design file, with their own buttons made tappable: open a
 * world from Home, switch between its Board, Chats and Space, and jump to People. Hotspot
 * positions are percentages of the 444 × 898 phone frame.
 */
type Screen = "home" | "board" | "groups" | "world" | "people";
type Spot = { to: Screen; label: string; x: number; y: number; w: number; h: number };

const TAB_Y = 90.4;
const TABS: Spot[] = [
  { to: "home", label: "Home", x: 15.7, y: TAB_Y, w: 11, h: 5 },
  { to: "people", label: "People", x: 32.7, y: TAB_Y, w: 11, h: 5 },
];
const SEGMENTS: Spot[] = [
  { to: "board", label: "Board", x: 22, y: 84.3, w: 22, h: 4 },
  { to: "groups", label: "Chats", x: 48.3, y: 84.3, w: 22, h: 4 },
  { to: "world", label: "Space", x: 76.7, y: 84.3, w: 22, h: 4 },
];
const BACK: Spot = { to: "home", label: "Back to Home", x: 13.3, y: 10.3, w: 18, h: 4 };

const SCREENS: Record<Screen, { name: string; caption: string; spots: Spot[] }> = {
  home: {
    name: "Home",
    caption: "Home: every world you've joined, one per creator. Tap Murder With My Husband to go in.",
    spots: [{ to: "board", label: "Open Murder With My Husband World", x: 50, y: 66.5, w: 88, h: 7 }, ...TABS],
  },
  board: {
    name: "Board",
    caption: "Board: posts and votes, like Reddit, with the creator's pins on top.",
    spots: [BACK, ...SEGMENTS, ...TABS],
  },
  groups: {
    name: "Chats",
    caption: "Chats: the world's group chats, from announcements to groups fans start.",
    spots: [BACK, ...SEGMENTS, ...TABS],
  },
  world: {
    name: "Space",
    caption: "Space: the same world in 3D, with its chat one tap away.",
    spots: [{ to: "groups", label: "Open the world's chats", x: 21.6, y: 84, w: 10, h: 4 }, ...TABS],
  },
  people: {
    name: "People",
    caption: "People: friends and creators, with the same avatar everywhere.",
    spots: [...TABS],
  },
};

const ORDER: Screen[] = ["home", "board", "groups", "world", "people"];

export function WorldsDemo() {
  const [screen, setScreen] = useState<Screen>("home");
  const current = SCREENS[screen];

  return (
    <figure className={demo.demo}>
      <div className={styles.phone}>
        {ORDER.map((s) => (
          // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
          <img
            key={s}
            src={`/work/moment/phone-${s}.webp`}
            alt={s === screen ? `Worlds, ${SCREENS[s].name} screen` : ""}
            width={560}
            height={1138}
            className={styles.screen}
            data-active={s === screen || undefined}
          />
        ))}
        {current.spots.map((spot) => (
          <button
            key={`${screen}-${spot.label}`}
            type="button"
            className={styles.spot}
            aria-label={spot.label}
            style={{
              left: `${spot.x - spot.w / 2}%`,
              top: `${spot.y - spot.h / 2}%`,
              width: `${spot.w}%`,
              height: `${spot.h}%`,
            }}
            onClick={() => setScreen(spot.to)}
          />
        ))}
      </div>

      <div className={demo.toggle}>
        {ORDER.map((s) => (
          <button key={s} type="button" aria-pressed={s === screen} onClick={() => setScreen(s)}>
            {SCREENS[s].name}
          </button>
        ))}
      </div>

      <figcaption className={demo.caption} aria-live="polite">
        {current.caption}
      </figcaption>
    </figure>
  );
}
