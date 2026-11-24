"use client";

import { useEffect, useState, type ReactNode } from "react";
import styles from "./galleries.module.css";

const VIEWS = [
  { id: "by-exhibition", label: "By exhibition" },
  { id: "by-artist", label: "By artist" },
] as const;
type View = (typeof VIEWS)[number]["id"];

/**
 * Two ways through the same prints: by exhibition (the default), one room per visit, or by artist.
 * The choice lives in the address (#by-artist), so a link can open either.
 */
export function Views({ views }: { views: Record<View, ReactNode> }) {
  const [view, setView] = useState<View>("by-exhibition");
  useEffect(() => {
    const read = () => setView(location.hash === "#by-artist" ? "by-artist" : "by-exhibition");
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
              history.replaceState(null, "", id === "by-exhibition" ? location.pathname : `#${id}`);
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
