import styles from "./galleries.module.css";

function hash(text: string) {
  let h = 2166136261;
  for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** A number from -1 to 1 for the nth letter, the same on every build. */
const wobble = (seed: number, n: number) => ((hash(`${seed}:${n}`) % 2001) - 1000) / 1000;

/**
 * Text written by hand: each letter a little rotated, off the baseline and unevenly spaced, the
 * way a pen goes on a print. The wobble comes from the text, so it never changes between visits.
 * The pen itself (font and ink) comes from --pen-font and --pen-ink on a parent. A long line is
 * written smaller so it fits the strip, as you would by hand.
 */
export function Handwriting({ text, className }: { text: string; className?: string }) {
  const seed = hash(text);
  return (
    <span className={`${styles.pen} ${className ?? ""}`} aria-label={text} style={{ "--len": text.length } as React.CSSProperties}>
      {text.split(" ").map((word, w, words) => {
        // Letters are numbered across the whole line, so each one keeps its own wobble.
        const start = words.slice(0, w).join(" ").length + (w ? 1 : 0);
        return (
          <span key={w} aria-hidden>
            <span style={{ whiteSpace: "nowrap" }}>
              {[...word].map((letter, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    transform: `translateY(${wobble(seed, start + i) * 0.07}em) rotate(${wobble(seed, start + i + 500) * 5}deg)`,
                    marginRight: `${wobble(seed, start + i + 900) * 0.03}em`,
                  }}
                >
                  {letter}
                </span>
              ))}
            </span>
            {w < words.length - 1 && " "}
          </span>
        );
      })}
    </span>
  );
}

/** How crooked a caption sits in its strip, in degrees, from its text. */
export const tilt = (text: string) => (((hash(text) % 2001) - 1000) / 1000) * 1.8;
