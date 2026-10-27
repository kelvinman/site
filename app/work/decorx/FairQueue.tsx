"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./demos.module.css";

/**
 * Why DecorX's job queue takes turns. Three brands send generation jobs at once, one of them a
 * big backlog, and two workers pick them up a round at a time. First come, first served makes
 * the small brands wait behind the big one; taking turns keeps every brand moving. A simulation
 * of the idea, not the real queue.
 */
const BRANDS = [
  { name: "Brand A", jobs: 18 },
  { name: "Brand B", jobs: 3 },
  { name: "Brand C", jobs: 2 },
];
const WORKERS = 2;
const ROUND_MS = 380;

/** The round each job starts in, per brand, for one way of ordering the queue. */
function schedule(fair: boolean) {
  const order: [number, number][] = [];
  if (fair) {
    // Round-robin across brands that still have work waiting.
    const next = BRANDS.map(() => 0);
    while (order.length < BRANDS.reduce((sum, brand) => sum + brand.jobs, 0)) {
      BRANDS.forEach((brand, b) => {
        if (next[b] < brand.jobs) order.push([b, next[b]++]);
      });
    }
  } else {
    // In the order they arrived: all of A's backlog first.
    BRANDS.forEach((brand, b) => {
      for (let j = 0; j < brand.jobs; j++) order.push([b, j]);
    });
  }
  const starts = BRANDS.map((brand) => new Array<number>(brand.jobs).fill(0));
  order.forEach(([b, j], position) => {
    starts[b][j] = Math.floor(position / WORKERS);
  });
  return starts;
}

export function FairQueue() {
  const ref = useRef<HTMLElement>(null);
  const [fair, setFair] = useState(false);
  const [round, setRound] = useState(-1);
  const [running, setRunning] = useState(false);

  const starts = useMemo(() => schedule(fair), [fair]);
  const lastRound = Math.max(...starts.flat()) + 1;
  // The round each brand's last job finishes in.
  const finish = starts.map((jobs) => Math.max(...jobs) + 1);

  // Plays once when it first scrolls into view; under reduced motion it waits for Play.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRound(0);
          setRunning(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Steps a round at a time until the last job is done.
  const playing = running && round < lastRound;
  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => setRound((r) => r + 1), ROUND_MS);
    return () => clearTimeout(timer);
  }, [playing, round]);

  const play = () => {
    setRound(0);
    setRunning(true);
  };

  const toggle = () => {
    setFair((value) => !value);
    play();
  };

  // Both orderings' finish rounds, so each caption can compare against the other.
  const finishes = useMemo(
    () => [false, true].map((mode) => schedule(mode).map((jobs) => Math.max(...jobs) + 1)),
    [],
  );
  const [served, turns] = finishes;
  const small = (f: number[]) => Math.max(f[1], f[2]);

  return (
    <figure ref={ref} className={demo.demo}>
      <div className={styles.queue} aria-hidden="true">
        {BRANDS.map((brand, b) => (
          <div key={brand.name} className={styles.lane}>
            <span className={styles.laneName}>{brand.name}</span>
            <span className={styles.jobs}>
              {starts[b].map((start, j) => (
                <i
                  key={j}
                  className={styles.job}
                  data-state={round > start ? "done" : round === start ? "running" : "waiting"}
                />
              ))}
            </span>
            <span className={styles.laneDone}>
              {round >= finish[b] ? `done in ${finish[b]}` : round >= 0 ? "…" : ""}
            </span>
          </div>
        ))}
      </div>

      <div className={demo.controls}>
        <button type="button" role="switch" aria-checked={fair} className={demo.switch} onClick={toggle}>
          <span className={demo.track}>
            <span className={demo.knob} />
          </span>
          Take turns
        </button>
        <button type="button" className={demo.textButton} onClick={play}>
          {round < 0 ? "Play" : "Replay"}
        </button>
      </div>

      <figcaption className={demo.caption} aria-live="polite">
        {fair
          ? `Taking turns: every brand with work waiting gets the next free worker. B and C are done by round ${small(turns)} instead of ${small(served)}, and A finishes ${turns[0] - served[0]} rounds later.`
          : `First come, first served: A's backlog arrived first, so B and C wait behind all of it and aren't done until round ${small(served)}.`}
      </figcaption>
    </figure>
  );
}
