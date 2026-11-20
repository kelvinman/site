"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./zoom.module.css";

// A case study still that opens larger on click. The image grows out of its place on the page to fit
// the window, with the page dimmed behind it. A click anywhere, or Escape, puts it back. The still
// itself is the button, so the page's layout and the styles on its image are untouched.
// Only stills and screenshots use this; the interactive demos keep their own clicks.
const OPEN = { duration: 420, easing: "cubic-bezier(0.2, 0.9, 0.25, 1)" };
const CLOSE = { duration: 300, easing: "cubic-bezier(0.4, 0, 0.2, 1)" };

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string };

export function Zoom({ className, ...img }: Props) {
  const [open, setOpen] = useState(false);
  const thumb = useRef<HTMLImageElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const big = useRef<HTMLImageElement>(null);
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

  // Open: show the dialog, then grow the image out of the still. With reduced motion it fades in.
  useEffect(() => {
    if (!open) return;
    const d = dialog.current!;
    d.showModal();
    closing.current = false;
    if (reduced()) {
      d.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: "ease-out" });
      return;
    }
    thumb.current!.style.visibility = "hidden";
    d.animate([{ "--dim": 0 } as Keyframe, { "--dim": 1 } as Keyframe], { duration: 300, easing: "ease-out" });
    big.current!.animate([{ transform: overThumb() }, { transform: "none" }], OPEN);
  }, [open]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const d = dialog.current!;
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
    d.animate([{ "--dim": 1 } as Keyframe, { "--dim": 0 } as Keyframe], { ...CLOSE, fill: "forwards" });
    big.current!.animate([{ transform: "none" }, { transform: overThumb() }], { ...CLOSE, fill: "forwards" }).onfinish = done;
  }, []);

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
          {/* eslint-disable-next-line @next/next/no-img-element -- the same file, already loaded */}
          <img ref={big} src={img.src} alt={img.alt} width={img.width} height={img.height} className={styles.big} />
          <button type="button" className={styles.close} autoFocus>
            Close
          </button>
        </dialog>
      )}
    </>
  );
}
