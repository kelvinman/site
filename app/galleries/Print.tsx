import styles from "./galleries.module.css";
import { Handwriting, tilt } from "./Handwriting";

// `print` is the photo rendered as an Instax print, card and all (made by scripts/instax-prints.mjs
// from `src`, which stays as the plain photo).
export type Print = { src: string; width: number; height: number; format: "mini" | "square" | "wide" };
// `show` and `runs` on a photo override its visit's, for a museum showing more than one exhibition.
export type Photo = { src: string; width: number; height: number; artists: string[]; work?: string; show?: string; runs?: string; link?: string; print: Print };
export type Visit = { slug: string; date: string; venue: string | null; show: string | null; runs?: string; link?: string; note?: string; photos: Photo[] };

// Card widths in millimetres. Every Instax card is 86mm tall, so prints of any format share a
// height and hang level.
export const CARD_WIDTH = { mini: 54, square: 72, wide: 108 };
// Pinned at a few sizes, so a wall reads as a hang rather than a contact sheet.
const SIZES = [0.86, 0.94, 1, 1.08];

export function hash(text: string) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

export const credit = (photo: Photo) => [photo.artists.join(", "), photo.work].filter(Boolean).join(", ");

/** One instant print, hung so its middle sits on the wall's line, captioned by hand in its strip. */
export function Piece({ photo, size }: { photo: Photo; size?: number }) {
  size ??= SIZES[(hash(photo.src) >>> 3) % SIZES.length];
  return (
    <figure className={styles.print} style={{ "--size": size, "--cw": CARD_WIDTH[photo.print.format] } as React.CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized */}
      <img src={photo.print.src} width={photo.print.width} height={photo.print.height} alt={credit(photo) || "Gallery snapshot"} loading="lazy" draggable={false} />
      {photo.artists.length + (photo.work ? 1 : 0) > 0 && (
        <figcaption className={styles.strip} style={{ transform: `rotate(${tilt(credit(photo))}deg)` }}>
          {photo.artists.length > 0 && <Handwriting text={photo.artists.join(", ")} />}
          {photo.work && <Handwriting text={photo.work} />}
        </figcaption>
      )}
    </figure>
  );
}

