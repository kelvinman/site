"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./note.module.css";

export type Section = { id: string; title: string };

/**
 * A note's page. On wide screens the side space holds a way back home and, when the note has
 * sections, a contents list that follows along as you read. On narrow screens the back link
 * sits above the title and the contents list is left out.
 */
export function NoteLayout({
  sections = [],
  back = { href: "/", label: "Home" },
  children,
}: {
  sections?: Section[];
  /** Where the top-left link goes: the page's parent. Home for notes, Work for case studies. */
  back?: { href: string; label: string };
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState(sections[0]?.id);

  // Highlight the section whose heading most recently passed the top third of the screen.
  useEffect(() => {
    if (!sections.length) return;
    const headings = sections.map((section) => document.getElementById(section.id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        const passed = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target.id);
        if (passed.length) setCurrent(passed[passed.length - 1]);
      },
      { rootMargin: "0px 0px -66% 0px" },
    );
    headings.forEach((heading) => observer.observe(heading));
    // The last section's heading may never reach the top third, so the bottom of the page
    // counts as being in it.
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        setCurrent(sections[sections.length - 1].id);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  return (
    <main className={styles.page}>
      <nav className={styles.rail} aria-label="Note">
        <Link href={back.href} className={styles.back}>
          ← {back.label}
        </Link>
        {sections.length > 0 && (
          <ol className={styles.contents}>
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={current === section.id ? "true" : undefined}
                  onClick={() => setCurrent(section.id)}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        )}
      </nav>
      <article className={`${styles.article} reveal`}>{children}</article>
    </main>
  );
}
