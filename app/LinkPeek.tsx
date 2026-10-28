"use client";

import { useEffect, useRef } from "react";
import previews from "./link-previews.json";
import styles from "./LinkPeek.module.css";

const PREVIEWS: Record<string, string> = previews;

/** While the pointer is over a link that leaves the site, or one to a note or case study, the linked page's share
 * image follows it. One listener for the whole document, so any such link on any page gets it without a wrapper;
 * scripts/fetch-link-previews.mjs decides which links have an image. Only on devices with a real
 * pointer, and not when motion is reduced. Adapted from Founding Designers' job list. */
export function LinkPeek() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    // Eases toward the pointer each frame, so the image trails it slightly instead of sticking.
    function tick() {
      const el = ref.current;
      if (!el) return;
      current.x += (target.x - current.x) * 0.22;
      current.y += (target.y - current.y) * 0.22;
      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      if (Math.abs(target.x - current.x) > 0.3 || Math.abs(target.y - current.y) > 0.3) frame = requestAnimationFrame(tick);
    }

    function hide() {
      if (ref.current) ref.current.dataset.visible = "false";
    }

    function move(event: PointerEvent) {
      const el = ref.current;
      if (!el || event.pointerType !== "mouse") return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      const src = link && PREVIEWS[link.getAttribute("href") ?? ""];
      if (!src) return hide();
      if (el.getAttribute("src") !== src) el.setAttribute("src", src);
      // Sit below and to the right of the pointer, flipping to the other side near the window's edges.
      const width = el.offsetWidth || 280;
      const height = el.offsetHeight || 147;
      const x = event.clientX + 24 + width > window.innerWidth ? event.clientX - 24 - width : event.clientX + 24;
      const y = event.clientY + 20 + height > window.innerHeight ? event.clientY - 20 - height : event.clientY + 20;
      const wasHidden = el.dataset.visible !== "true";
      target.x = x;
      target.y = y;
      if (wasHidden) Object.assign(current, target);
      el.dataset.visible = "true";
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
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
  return <img ref={ref} className={styles.peek} alt="" aria-hidden data-visible="false" />;
}
