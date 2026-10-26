import type { Metadata } from "next";
import styles from "../../page.module.css";
import { NoteHeader } from "../NoteHeader";
import { NoteLayout } from "../NoteLayout";
import { CodeBlock } from "../CodeBlock";
import { SafariPhone } from "../demos/SafariPhone";

export const metadata: Metadata = {
  title: "Under the glass · Kelvin Man",
  description: "How to make a full-screen hero show through the status bar and the floating toolbar in iOS Safari 26.",
};

const SECTIONS = [
  { id: "how-safari-decides", title: "How Safari decides" },
  { id: "the-recipe", title: "The recipe" },
  { id: "things-that-bit-me", title: "Things that bit me" },
];

export default function Note() {
  return (
    <NoteLayout sections={SECTIONS}>
        <NoteHeader slug="under-the-glass" />

        <p className={styles.body}>
          In iOS Safari 26 the toolbar floats over the page as a sheet of glass, and the status bar sits above it. On a
          full-screen hero you want your image to run under both. Even mymind.com only gets halfway: its page runs under
          the toolbar, but at the top of the page the status bar stays solid until you scroll. And a fixed hero
          doesn&apos;t get that far: Safari paints both bars a flat colour and the hero stops short.
        </p>

        <p className={styles.body}>Here&apos;s what I found about how Safari decides, and a recipe that works.</p>

        <h2 id="how-safari-decides" className={styles.subhead}>How Safari decides</h2>

        <ul className={styles.bullets}>
          <li>
            <strong>Fixed elements never go under the bars.</strong> Safari stops anything with{" "}
            <code>position: fixed</code> at both edges, whatever its height.
          </li>
          <li>
            <strong>But a fixed element can tint them.</strong> If it touches a bar and its edge is one solid colour, Safari
            fills the bar with that colour. A strip of about 6px is enough; 1px isn&apos;t.
          </li>
          <li>
            <strong>The bottom bar shows real content</strong> that runs past the bottom of the screen in normal flow, even
            on a page that can&apos;t scroll.
          </li>
          <li>
            <strong>The top bar only shows content once the page is scrolled.</strong> At the very top it&apos;s a solid
            colour. Scrolled, even by code and even with scrolling locked, the content above shows through, blurred.
          </li>
        </ul>

        <SafariPhone />

        <p className={styles.body}>
          So the trick is to make the page a little taller than the screen at both ends, and quietly scroll it to the
          middle.
        </p>

        <h2 id="the-recipe" className={styles.subhead}>The recipe</h2>

        <ol className={styles.bullets}>
          <li>
            Set <code>viewport-fit=cover</code>. In Next.js: <code>export const viewport = {"{ viewportFit: \"cover\" }"}</code>.
          </li>
          <li>
            Keep the hero in normal flow, not fixed, and make it taller than the screen:{" "}
            <code>calc(TOP + 100dvh + BOTTOM)</code>, with TOP at 100px and BOTTOM at 160px, more than any status bar or
            toolbar.
          </li>
          <li>
            On mount, lock scrolling and scroll down by TOP. Re-pin on resize; restore both on unmount.
          </li>
          <li>
            Put the real interface in a band inside it: <code>top: TOP</code>, height{" "}
            <code>calc(100% - TOP - BOTTOM)</code>. Let the background fill everything, overhangs included. That&apos;s what
            shows through.
          </li>
          <li>Keep fixed elements away from the top edge. They make Safari paint the bar solid again.</li>
        </ol>

        <CodeBlock
          code={`const TOP = 100
const BOTTOM = 160

useEffect(() => {
  const html = document.documentElement
  const body = document.body
  html.style.overflow = body.style.overflow = "hidden"
  const pin = () => window.scrollTo(0, TOP)
  pin()
  window.addEventListener("resize", pin)
  return () => {
    window.removeEventListener("resize", pin)
    html.style.overflow = body.style.overflow = ""
    window.scrollTo(0, 0)
  }
}, [])`}
        />

        <h2 id="things-that-bit-me" className={styles.subhead}>Things that bit me</h2>

        <ul className={styles.bullets}>
          <li>
            <strong>Animation stutters</strong> if a <code>translateY</code> mixes px with <code>dvh</code> or{" "}
            <code>lvh</code> inside <code>calc()</code>. Keep transforms in px.
          </li>
          <li>
            <strong>For a sheet over the hero,</strong> clip its overhang with{" "}
            <code>clip-path: inset(0 0 BOTTOMpx 0 round …)</code>, so the sheet, not the hero, sits under the toolbar.
          </li>
          <li>
            <strong>Test in the iOS Simulator,</strong> with a page of coloured stripes. Desktop browsers and headless
            Chrome can&apos;t show any of this.
          </li>
          <li>
            <strong>On a real phone against a Next.js dev server,</strong> add your Mac&apos;s LAN address to{" "}
            <code>allowedDevOrigins</code>, or the phone gets a blank page.
          </li>
        </ul>

        <p className={styles.meta}>
          Tested in the iOS simulator in October 2026. Safari changes this between releases, so re-test before you trust it.
        </p>
    </NoteLayout>
  );
}
