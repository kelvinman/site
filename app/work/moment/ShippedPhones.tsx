"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./moment.module.css";

/** The screenshot in its three parts: the app's header, the 3D view and the chat bar. Each is its
 *  own file, cut from the 750 by 1272 capture, with its width and height. */
const AREAS = {
  top: { src: "/work/moment/world-mobile-top.webp", width: 750, height: 86 },
  world: { src: "/work/moment/world-mobile-world.webp", width: 650, height: 1077 },
  bottom: { src: "/work/moment/world-mobile-bottom.webp", width: 750, height: 105 },
} as const;

type Area = keyof typeof AREAS;

/** Each control: which part it is in, its centre and size in that part's own pixels, how round it
 *  is (a share of its height), and what it does, as the caption finishes it. */
const PARTS: { area: Area; x: number; y: number; w: number; h: number; round: number; name: string; text: string }[] = [
  { area: "top", x: 465, y: 44, w: 54, h: 54, round: 0.5, name: "Sound", text: "off until turned on." },
  { area: "world", x: 520, y: 897, w: 236, h: 236, round: 0.5, name: "Joystick", text: "moves your avatar." },
  { area: "world", x: 70, y: 956, w: 96, h: 96, round: 0.24, name: "Run", text: "walk or run." },
  { area: "bottom", x: 375, y: 55, w: 494, h: 72, round: 0.5, name: "Chat", text: "talks to everyone here." },
];

type Box = { left: number; top: number; width: number; height: number; radius: number };

/** iOS's status bar icons: signal, wifi and battery, drawn small in white. */
function StatusIcons() {
  return (
    <svg viewBox="0 0 68 12" aria-hidden="true">
      <rect x="0" y="8" width="3" height="4" rx="1" />
      <rect x="4.5" y="6" width="3" height="6" rx="1" />
      <rect x="9" y="3.5" width="3" height="8.5" rx="1" />
      <rect x="13.5" y="1" width="3" height="11" rx="1" />
      <path d="M30 11.5l-2.4-2.6a3.4 3.4 0 014.8 0zM25.4 6.6a6.6 6.6 0 019.2 0l-1.4 1.5a4.6 4.6 0 00-6.4 0zM23 4.2a10 10 0 0114 0l-1.4 1.5a8 8 0 00-11.2 0z" />
      <rect x="42" y="1" width="22" height="11" rx="3.4" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="44" y="3" width="15" height="7" rx="1.8" />
      <path d="M65.5 4.5v4a2 2 0 000-4z" fillOpacity="0.4" />
    </svg>
  );
}

/** The 3D space on mobile web, from a screenshot of jessiivee.world.co in 2023, on the same iPhone as
 *  the iOS screens above it. The header sits under the status bar and the chat bar above the home
 *  bar, and the 3D view fills the screen between them, as the app did on a taller phone. A toggle
 *  under it picks out each control with a spotlight, and the caption says what it does, the same
 *  way the Worlds demo above it works. */
export function ShippedPhones() {
  const [active, setActive] = useState(0);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const device = useRef<HTMLDivElement>(null);
  const areas = useRef<Partial<Record<Area, HTMLDivElement | null>>>({});

  // Where each control lands on screen, in pixels from the screen's top left. The 3D view is
  // cropped to fill its space, so its controls are placed through the same crop.
  const measure = useCallback(() => {
    const d = device.current?.getBoundingClientRect();
    if (!d) return;
    setBoxes(
      PARTS.map((part) => {
        const a = areas.current[part.area]?.getBoundingClientRect();
        if (!a) return { left: 0, top: 0, width: 0, height: 0, radius: 0 };
        const natural = AREAS[part.area];
        const scale = Math.max(a.width / natural.width, a.height / natural.height);
        const offsetX = (a.width - natural.width * scale) / 2;
        const offsetY = (a.height - natural.height * scale) / 2;
        const width = part.w * scale;
        const height = part.h * scale;
        return {
          left: a.left - d.left + offsetX + part.x * scale - width / 2,
          top: a.top - d.top + offsetY + part.y * scale - height / 2,
          width,
          height,
          radius: height * part.round,
        };
      }),
    );
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const spot = boxes[active];
  const current = PARTS[active];

  return (
    <figure className={demo.demo}>
      <div className={styles.anatomy}>
        <div className={styles.anatomyShot}>
          <div className={styles.device} ref={device}>
            <div className={styles.statusBar} aria-hidden="true">
              <span>9:41</span>
              <StatusIcons />
            </div>
            {(Object.keys(AREAS) as Area[]).map((area) => (
              <div
                key={area}
                ref={(el) => {
                  areas.current[area] = el;
                }}
                className={styles.area}
                data-area={area}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
                <img
                  src={AREAS[area].src}
                  alt={
                    area === "world"
                      ? "Jessii Vee World on a phone: the 3D space with a joystick, a run button and a chat bar"
                      : ""
                  }
                  width={AREAS[area].width}
                  height={AREAS[area].height}
                  onLoad={measure}
                />
              </div>
            ))}
            <span className={styles.homeBar} aria-hidden="true" />

            {/* A spotlight on the chosen control, its shade stopping at the glass. */}
            <div className={styles.screenOverlay}>
              {spot && (
                <span
                  className={styles.spotlight}
                  style={{
                    left: spot.left,
                    top: spot.top,
                    width: spot.width,
                    height: spot.height,
                    borderRadius: spot.radius,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={demo.toggle} role="group" aria-label="Controls">
        {PARTS.map((part, i) => (
          <button
            key={part.name}
            type="button"
            aria-pressed={active === i}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            {part.name}
          </button>
        ))}
      </div>

      <figcaption className={demo.caption} aria-live="polite">
        {current.name}: {current.text}
      </figcaption>
    </figure>
  );
}
