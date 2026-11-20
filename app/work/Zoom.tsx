"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./zoom.module.css";

// A case study still that opens larger on click, the same move as picking up a print on the galleries
// page: it flies out of its place to the middle of the screen over the page dimmed and blurred, with
// its caption in a pill below. A click anywhere, Escape or a scroll puts it back. Unlike a print it
// doesn't tilt or catch the light, since a screenshot has text to read. The still itself is the
// button, so the page's layout and the styles on its image are untouched. Only stills use this;
// the interactive demos keep their own clicks.
const FLY = { duration: 560, easing: "cubic-bezier(0.2, 0.9, 0.25, 1)" };
const BACK = { duration: 420, easing: "cubic-bezier(0.4, 0, 0.2, 1)" };

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  /** The words in the pill under the open image; the alt text when left out. */
  caption?: string;
};

export function Zoom({ className, caption, ...img }: Props) {
  const [open, setOpen] = useState(false);
  const thumb = useRef<HTMLImageElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const big = useRef<HTMLImageElement>(null);
  const pill = useRef<HTMLParagraphElement>(null);
  const closing = useRef(false);

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The transform that lays the large image exactly over the still on the page.
  const overThumb = () => {
    const from = thumb.current!.getBoundingClientRect();
    const to = big.current!.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2);
    const dy = from.top + from.height / 2 - (to.top + to.height / 2);
    return `translate(${dx}px, ${dy}px) scale(${from.width / to.width}, ${from.height / to.height})`;
  };

  const close = useCallback(() => {
    if (closing.current || !dialog.current) return;
    closing.current = true;
    const d = dialog.current;
    const done = () => {
      d.close();
      if (thumb.current) thumb.current.style.visibility = "";
      setOpen(false);
      thumb.current?.focus({ preventScroll: true });
    };
    if (reduced()) {
      d.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }).onfinish = done;
      return;
    }
    backdrop.current!.animate([{ opacity: 1 }, { opacity: 0 }], { ...BACK, fill: "forwards" });
    pill.current!.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: "forwards" });
    big.current!.animate([{ transform: "none" }, { transform: overThumb() }], { ...BACK, fill: "forwards" }).onfinish = done;
  }, []);

  // Open: show the dialog, then fly the image out of the still. With reduced motion it fades in.
  useEffect(() => {
    if (!open) return;
    const d = dialog.current!;
    d.showModal();
    closing.current = false;
    if (reduced()) {
      d.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: "ease-out" });
    } else {
      thumb.current!.style.visibility = "hidden";
      big.current!.animate([{ transform: overThumb() }, { transform: "none" }], FLY);
      backdrop.current!.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "ease-out" });
      pill.current!.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], {
        duration: 300,
        delay: 320,
        easing: "ease-out",
        fill: "backwards",
      });
    }
    // Scrolling the page puts it back, as on the galleries page. A few pixels of drift, such as a
    // trackpad still coasting when the still was clicked, don't count.
    const y0 = window.scrollY;
    const onScroll = () => Math.abs(window.scrollY - y0) > 24 && close();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open, close]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
      <img
        {...img}
        ref={thumb}
        className={[className, styles.thumb].filter(Boolean).join(" ")}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-label={`${img.alt}. Enlarge`}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      {open && (
        <dialog
          ref={dialog}
          className={styles.dialog}
          aria-label={img.alt}
          onClick={close}
          onCancel={(e) => {
            // Escape: run the same closing motion rather than vanishing.
            e.preventDefault();
            close();
          }}
        >
          <div ref={backdrop} className={styles.backdrop} />
          {/* eslint-disable-next-line @next/next/no-img-element -- the same file, already loaded */}
          <img ref={big} src={img.src} alt={img.alt} width={img.width} height={img.height} className={styles.big} />
          <p ref={pill} className={styles.pill}>
            {caption ?? img.alt}
          </p>
          <button type="button" className={styles.srOnly} autoFocus>
            Close
          </button>
        </dialog>
      )}
    </>
  );
}
