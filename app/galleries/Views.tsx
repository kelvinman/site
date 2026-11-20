"use client";

import { useEffect, useState, type ReactNode } from "react";
import styles from "./galleries.module.css";

const VIEWS = [
  { id: "by-artist", label: "By artist" },
  { id: "by-exhibition", label: "By exhibition" },
] as const;
type View = (typeof VIEWS)[number]["id"];

/**
 * Two ways through the same prints: by artist (the default) or by exhibition, one room per visit.
 * The choice lives in the address (#by-exhibition), so a link can open either.
 */
export function Views({ views }: { views: Record<View, ReactNode> }) {
  const [view, setView] = useState<View>("by-artist");
  useEffect(() => {
    const read = () => setView(location.hash === "#by-exhibition" ? "by-exhibition" : "by-artist");
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  return (
    <>
      <nav className={styles.switcher} aria-label="Arrange the prints">
        {VIEWS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={styles.view}
            aria-current={view === id ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              history.replaceState(null, "", id === "by-artist" ? location.pathname : `#${id}`);
              setView(id);
            }}
          >
            {label}
          </a>
        ))}
      </nav>
      {views[view]}
    </>
  );
}
