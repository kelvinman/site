"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./galleries.module.css";
import { CARD_WIDTH, credit, hash, Piece, type Photo } from "./Print";

// After the speaker cards on tokyodesignforum.com: pick a print up and it flies out of its slot to
// the middle of the screen, larger, with the page dimmed behind it. While you hold it, it tilts
// toward the pointer with light moving across it. Click anywhere, or press Escape, and it goes back.
// Prints lying on the table can also be dragged around and stay where they are dropped, like photos
// spread out on a table; a click without a drag still picks one up.
const FLY = { duration: 560, easing: "cubic-bezier(0.2, 0.9, 0.25, 1)" };
const BACK = { duration: 420, easing: "cubic-bezier(0.4, 0, 0.2, 1)" };
const MAX_TILT = 14; // degrees at the card's edge
const SETTLE = { duration: 380, easing: "cubic-bezier(0.25, 1.4, 0.45, 1)" }; // dropping back onto the table
const SWAY = 0.6; // degrees of turn per px/ms of sideways speed, as a photo swings when slid across a table
const MAX_SWAY = 8;

// The last print moved lies on top of the others, as on a real table.
let onTop = 1;

/** A number from -1 to 1, the same for this photo on every visit. */
const spread = (src: string, salt: string) => ((hash(src + salt) % 2001) - 1000) / 1000;

/**
 * How a print lies in the scatter, after Kelvin's reference of photos laid out loosely (13 Nov
 * 2026): a little turned, nudged up or down, and leaning back as if on a table.
 */
function lean(src: string) {
  return { turn: spread(src, "z") * 2.8, lift: spread(src, "dy") * 16, tipX: spread(src, "x") * 5, tipY: spread(src, "y") * 7 };
}

export function Lift({ photo, where }: { photo: Photo; where: string }) {
  const [state, setState] = useState<"rest" | "lifted" | "closing">("rest");
  const slot = useRef<HTMLButtonElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const tiltEl = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLParagraphElement>(null);
  const putBack = useRef<HTMLButtonElement>(null);
  // Where the print has been slid to on the table, and the drag in progress.
  const [pos, setPos] = useState({ x: 0, y: 0, z: 0 });
  const drag = useRef<{ x0: number; y0: number; x: number; y: number; t: number; vx: number; moved: boolean } | null>(null);
  const dragged = useRef(false); // the click that ends a drag should not also pick the print up
  const [host, setHost] = useState<HTMLElement | null>(null);
  const refocus = useRef(false);

  // Back in its slot and visible again: return keyboard focus to it.
  useEffect(() => {
    if (state === "rest" && refocus.current) {
      refocus.current = false;
      slot.current?.focus({ preventScroll: true });
    }
  }, [state]);

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The transform that puts the lifted card exactly over its slot, so it can fly from or back to it.
  // The slot is turned, so its box is measured without the turn: its centre from the bounding box
  // (turning keeps the centre), its width from layout. The card starts and ends at the same turn.
  const { turn, lift: nudge, tipX, tipY } = lean(photo.src);
  const overSlot = useCallback(() => {
    const from = slot.current!.getBoundingClientRect();
    const to = card.current!.getBoundingClientRect();
    const s = slot.current!.offsetWidth / card.current!.offsetWidth;
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${s}) rotate(${turn}deg)`;
  }, [turn]);

  const lift = () => {
    setHost(slot.current!.closest("main"));
    setState("lifted");
  };

  const close = useCallback(() => {
    if (state !== "lifted") return;
    setState("closing");
    const done = () => {
      refocus.current = true;
      setState("rest");
    };
    if (reduced() || !card.current) return done();
    tiltEl.current!.style.transform = "";
    backdrop.current?.animate([{ opacity: 1 }, { opacity: 0 }], { ...BACK, fill: "forwards" });
    pill.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: "forwards" });
    card.current.animate([{ transform: "none" }, { transform: overSlot() }], { ...BACK, fill: "forwards" }).onfinish = done;
  }, [state, overSlot]);

  // Fly out of the slot once the lifted card is on screen.
  useLayoutEffect(() => {
    if (state !== "lifted" || !card.current) return;
    putBack.current?.focus({ preventScroll: true });
    if (reduced()) return;
    card.current.animate([{ transform: overSlot() }, { transform: "none" }], FLY);
    backdrop.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease-out" });
    pill.current?.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 300, delay: 320, easing: "ease-out", fill: "backwards" });
  }, [state, host, overSlot]);

  // While held: tilt toward the pointer, eased so it follows like a card in hand; Escape puts it back.
  useEffect(() => {
    if (state !== "lifted") return;
    const target = { x: 0, y: 0 };
    const now = { x: 0, y: 0 };
    let frame = 0;
    const tick = () => {
      now.x += (target.x - now.x) * 0.12;
      now.y += (target.y - now.y) * 0.12;
      const el = tiltEl.current;
      if (el) {
        el.style.transform = `rotateX(${-now.y * MAX_TILT}deg) rotateY(${now.x * MAX_TILT}deg)`;
        el.style.setProperty("--gx", `${50 + now.x * 50}%`);
        el.style.setProperty("--gy", `${50 + now.y * 50}%`);
      }
      frame = Math.abs(target.x - now.x) + Math.abs(target.y - now.y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      if (reduced() || !card.current) return;
      const r = card.current.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      target.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("pointermove", move);
    window.addEventListener("keydown", key);
    window.addEventListener("scroll", close, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("keydown", key);
      window.removeEventListener("scroll", close);
    };
  }, [state, close]);

  // Sliding a print across the table. Pointer capture keeps it following even off the print. On a
  // phone the print still lets the page scroll up and down, so it slides sideways under a finger.
  const lie = (x: number, y: number, sway = 0) =>
    `translate(${x}px, ${y + nudge}px) rotateX(${tipX}deg) rotateY(${tipY}deg) rotate(${turn + sway}deg)`;
  const grab = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    try {
      slot.current!.setPointerCapture(e.pointerId);
    } catch {
      // A pointer that has already gone (or a synthetic one) cannot be captured; sliding still works.
    }
    drag.current = { x0: e.clientX - pos.x, y0: e.clientY - pos.y, x: e.clientX, y: e.clientY, t: performance.now(), vx: 0, moved: false };
  };
  const slide = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    d.vx = d.vx * 0.6 + ((e.clientX - d.x) / Math.max(8, now - d.t)) * 0.4;
    Object.assign(d, { x: e.clientX, y: e.clientY, t: now });
    const x = e.clientX - d.x0;
    const y = e.clientY - d.y0;
    if (!d.moved && Math.hypot(x - pos.x, y - pos.y) > 5) {
      d.moved = true;
      slot.current!.style.zIndex = String(++onTop);
      slot.current!.dataset.sliding = "";
    }
    if (d.moved) {
      const sway = reduced() ? 0 : Math.max(-MAX_SWAY, Math.min(MAX_SWAY, d.vx * SWAY * 10));
      slot.current!.style.transform = lie(x, y, sway);
    }
  };
  const drop = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    dragged.current = true;
    delete slot.current!.dataset.sliding;
    const x = e.clientX - d.x0;
    const y = e.clientY - d.y0;
    const from = slot.current!.style.transform;
    setPos({ x, y, z: onTop });
    if (!reduced()) slot.current!.animate([{ transform: from }, { transform: lie(x, y) }], SETTLE);
  };

  // The room strips the artist from the print, so the label leads with the work and adds `where`.
  const label = [credit(photo), where].filter(Boolean).join(", ");
  return (
    <>
      <button
        ref={slot}
        type="button"
        className={styles.slot}
        aria-label={`${label}. Pick up the print`}
        style={{
          visibility: state === "rest" ? "visible" : "hidden",
          transform: lie(pos.x, pos.y),
          zIndex: pos.z || undefined,
        }}
        onPointerDown={grab}
        onPointerMove={slide}
        onPointerUp={drop}
        onPointerCancel={drop}
        onClick={() => {
          if (dragged.current) dragged.current = false;
          else lift();
        }}
      >
        <Piece photo={photo} />
      </button>
      {state !== "rest" &&
        host &&
        createPortal(
          <div className={styles.stage} role="dialog" aria-modal="true" aria-label={label} onClick={close}>
            <div ref={backdrop} className={styles.backdrop} />
            <div ref={card} className={styles.lifted} style={{ "--cw": CARD_WIDTH[photo.print.format] } as React.CSSProperties}>
              <div ref={tiltEl} className={styles.tilt}>
                <Piece photo={photo} size={1} />
                <div className={styles.sheen} />
              </div>
            </div>
            <p ref={pill} className={styles.pill}>
              {where}
            </p>
            <button ref={putBack} type="button" className={styles.srOnly} onClick={close}>
              Put it back
            </button>
          </div>,
          host,
        )}
    </>
  );
}
