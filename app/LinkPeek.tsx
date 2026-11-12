"use client";

import { useEffect, useRef } from "react";
import previews from "./link-previews.json";
import styles from "./LinkPeek.module.css";

const PREVIEWS: Record<string, string> = previews;

// Gap between the pointer and the image's bottom edge, and the least room it keeps from the window's edges.
const GAP = 24;
const EDGE = 8;
// The image follows the pointer on a spring that settles without bouncing.
const FOLLOW = { stiffness: 520, damping: 42 };
// It hangs from the pointer and swings with sideways speed: degrees per px/s, capped.
const SWING_PER_SPEED = 0.009;
const SWING_MAX = 10;
// An underdamped spring on the angle, so it overshoots and wiggles back to level when the pointer stops.
const SWING = { stiffness: 260, damping: 11 };
// Appearing grows it out of the pointer with a small overshoot; leaving shrinks it back without one.
const APPEAR = { stiffness: 340, damping: 22 };
const LEAVE = { stiffness: 420, damping: 42 };
// Tilt it arrives with, which the swing spring shakes out, and the tilt it takes as it shrinks away.
const ENTRY_TILT = 8;
const EXIT_TILT = 5;
const MIN_SCALE = 0.2;

type Spring = { stiffness: number; damping: number };

function step(value: number, velocity: number, to: number, spring: Spring, dt: number) {
  velocity += (-spring.stiffness * (value - to) - spring.damping * velocity) * dt;
  return [value + velocity * dt, velocity];
}

/** While the pointer is over a link that leaves the site, or one to a note or case study, the linked page's share
 * image follows it. One listener for the whole document, so any such link on any page gets it without a wrapper;
 * scripts/fetch-link-previews.mjs decides which links have an image. Only on devices with a real
 * pointer, and not when motion is reduced. Adapted from Founding Designers' job list; the swing, and the way it
 * grows out of and back into the pointer, after joshpuckett.me. */
export function LinkPeek() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0, vx: 0, vy: 0 };
    const swing = { angle: 0, velocity: 0 };
    // 0 is gone, 1 is fully shown; scale, opacity and the exit tilt all follow it.
    const presence = { value: 0, velocity: 0, to: 0 };
    // +1 while the image sits below the pointer, -1 when flipped above it, so it always hangs the right way.
    let hang = 1;
    let frame = 0;
    let last = 0;

    function tick(now: number) {
      const el = ref.current;
      if (!el) return;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      [pos.x, pos.vx] = step(pos.x, pos.vx, target.x, FOLLOW, dt);
      [pos.y, pos.vy] = step(pos.y, pos.vy, target.y, FOLLOW, dt);

      // Moving right drags the image behind the pointer: it tilts counterclockwise above it, clockwise below.
      const lean = Math.max(-SWING_MAX, Math.min(SWING_MAX, pos.vx * SWING_PER_SPEED)) * hang;
      [swing.angle, swing.velocity] = step(swing.angle, swing.velocity, lean, SWING, dt);

      [presence.value, presence.velocity] = step(presence.value, presence.velocity, presence.to, presence.to ? APPEAR : LEAVE, dt);
      const p = Math.max(0, presence.value);
      const leaving = presence.to === 0 ? -EXIT_TILT * hang * (1 - p) : 0;
      el.style.opacity = String(Math.min(1, p * 1.6));
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${swing.angle + leaving}deg) scale(${MIN_SCALE + (1 - MIN_SCALE) * p})`;

      const moving = Math.abs(target.x - pos.x) > 0.3 || Math.abs(target.y - pos.y) > 0.3 || Math.abs(pos.vx) + Math.abs(pos.vy) > 2;
      const swinging = Math.abs(swing.angle - lean) > 0.05 || Math.abs(swing.velocity) > 0.5;
      const fading = Math.abs(presence.value - presence.to) > 0.002 || Math.abs(presence.velocity) > 0.01;
      if (presence.to === 0 && p < 0.01) {
        el.style.opacity = "0";
        frame = 0;
      } else {
        frame = moving || swinging || fading ? requestAnimationFrame(tick) : 0;
      }
    }

    function start() {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }

    function hide() {
      if (presence.to === 0) return;
      presence.to = 0;
      start();
    }

    function move(event: PointerEvent) {
      const el = ref.current;
      if (!el || event.pointerType !== "mouse") return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      const src = link && PREVIEWS[link.getAttribute("href") ?? ""];
      // Off a link it still trails the pointer while it shrinks away.
      const gone = presence.to === 0 && presence.value < 0.01;
      if (!src && gone) return;
      if (src && el.getAttribute("src") !== src) el.setAttribute("src", src);
      // Sit centered above the pointer, kept inside the window, and drop below it only when the top has no room.
      const width = el.offsetWidth || 280;
      const height = el.offsetHeight || 147;
      const above = event.clientY - GAP - height >= EDGE;
      target.x = Math.max(EDGE, Math.min(window.innerWidth - width - EDGE, event.clientX - width / 2));
      target.y = above ? event.clientY - GAP - height : event.clientY + GAP;
      hang = above ? -1 : 1;
      // Pivot on the pointer, so it swings, grows and shrinks from where it hangs rather than from its middle.
      el.style.transformOrigin = `${event.clientX - target.x}px ${above ? height + GAP : -GAP}px`;
      if (!src) return hide();
      if (gone) {
        Object.assign(pos, { x: target.x, y: target.y, vx: 0, vy: 0 });
        swing.angle = -ENTRY_TILT * hang;
        swing.velocity = 0;
        presence.velocity = 0;
      }
      presence.to = 1;
      start();
    }

    // Scrolling moves the link out from under a still pointer, and a click opens a new tab.
    document.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("blur", hide);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("scroll", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);

  // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized
  return <img ref={ref} className={styles.peek} alt="" aria-hidden />;
}
