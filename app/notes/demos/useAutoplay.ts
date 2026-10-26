"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Plays a muted, looping video while it's on screen and pauses it when it isn't. Under
 * reduced motion it waits for a tap. `toggle` pauses or resumes it, and a pause by hand
 * sticks until the next tap.
 */
export function useAutoplay() {
  const video = useRef<HTMLVideoElement>(null);
  const held = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    held.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    element.addEventListener("play", onPlay);
    element.addEventListener("pause", onPause);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !held.current) element.play().catch(() => {});
        else element.pause();
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      element.removeEventListener("play", onPlay);
      element.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = useCallback(() => {
    const element = video.current;
    if (!element) return;
    held.current = !element.paused;
    if (element.paused) element.play().catch(() => {});
    else element.pause();
  }, []);

  return { video, playing, toggle };
}
