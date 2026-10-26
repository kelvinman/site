"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./demos.module.css";
import { eyeSeal } from "./eye";

const MIN = 16;
const MAX = 96;
const BREATH_MS = 9000;

/**
 * Drag the size and the same formula redraws the Eye, pixel by pixel. Until someone touches
 * the controls, the size eases between the smallest and largest on its own while the Eye is on
 * screen, so the redrawing is visible from the start. Reduced motion leaves it still.
 */
export function EyeFromRules() {
  const figureRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState(48);
  const [outline, setOutline] = useState(true);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = size;
    canvas.height = size;
    const image = ctx.createImageData(size, size);
    eyeSeal(size, outline).forEach((color, i) => {
      if (!color) return;
      image.data[i * 4] = parseInt(color.slice(1, 3), 16);
      image.data[i * 4 + 1] = parseInt(color.slice(3, 5), 16);
      image.data[i * 4 + 2] = parseInt(color.slice(5, 7), 16);
      image.data[i * 4 + 3] = 255;
    });
    ctx.putImageData(image, 0, 0);
  }, [size, outline]);

  useEffect(() => {
    const figure = figureRef.current;
    if (!auto || !figure || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now - BREATH_MS * 0.4; // Begin near the middle, where it already reads as the Eye.
      const phase = ((now - start) % BREATH_MS) / BREATH_MS;
      setSize(Math.round(MIN + (MAX - MIN) * (0.5 - 0.5 * Math.cos(phase * Math.PI * 2))));
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      if (entry.isIntersecting) frame = requestAnimationFrame(tick);
    });
    observer.observe(figure);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [auto]);

  const fill = ((size - MIN) / (MAX - MIN)) * 100;

  return (
    <figure ref={figureRef} className={styles.demo}>
      <canvas ref={canvasRef} className={styles.eye} role="img" aria-label={`The Eye of the Logos, drawn at ${size} by ${size} pixels.`} />
      <div className={styles.controls}>
        <label className={styles.range}>
          <span className={styles.value}>{size}px</span>
          <input
            type="range"
            className={styles.slider}
            min={MIN}
            max={MAX}
            step={1}
            value={size}
            style={{ "--fill": `${fill}%` } as React.CSSProperties}
            onPointerDown={() => setAuto(false)}
            onChange={(event) => {
              setAuto(false);
              setSize(Number(event.target.value));
            }}
          />
        </label>
        <button
          type="button"
          role="switch"
          className={styles.switch}
          aria-checked={outline}
          onClick={() => {
            setAuto(false);
            setOutline((value) => !value);
          }}
        >
          <span className={styles.track} aria-hidden="true">
            <span className={styles.knob} />
          </span>
          Outline
        </button>
      </div>
      <figcaption className={styles.caption}>
        The Eye of the Logos isn&apos;t a drawing. It&apos;s a rule: rays where the angle allows, a ring, lids, an iris.
        Drag the size and the same rule redraws it.
      </figcaption>
    </figure>
  );
}
