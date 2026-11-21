// Renders the share cards (the images a link shows when posted) in the site's dark palette:
// the home card, one per note and one per case study, all 1200 by 630.
//
//   node scripts/share-cards.mjs
//
// Each card is a small HTML page in the site's fonts, screenshotted by a headless Chrome. The covers
// and the logos on the home card are source images in scripts/share-cards/. Set CHROME to a Chrome or
// chrome-headless-shell binary; by default it uses the newest one Playwright has cached.
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = join(ROOT, "scripts/share-cards");

// The site's dark palette, from app/globals.css.
const C = { background: "#1c1a18", foreground: "#f3f1ee", muted: "#a39d96", accent: "#e48a62" };

const NOTES = [
  { out: "app/notes/under-the-glass/opengraph-image.png", title: "Under the glass", line: "How to make a full-screen hero run under the status bar and toolbar in iOS Safari 26." },
  { out: "app/notes/the-thinking-i-kept/opengraph-image.png", title: "The thinking I kept", line: "On making The Last Apostate, a game about how much of your thinking you’ve handed over." },
];

const CASES = [
  { slug: "decorx", title: "DecorX", line: "Two products became one AI platform, now used by Wayfair." },
  { slug: "mirascope", title: "Mirascope", line: "An LLM tool that judges every answer right beside it." },
  { slug: "moment", title: "Moment", line: "A space for each creator's community, before Patreon bought it." },
  { slug: "sidecar-legal", title: "Sidecar Legal", line: "A payout estimate that shows a range, not a single number." },
  { slug: "wethos", title: "Wethos", line: "Ready-made scopes that cut proposal writing from hours to one." },
];

const page = (body) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400&family=Inconsolata:wght@400&display=block">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; background: ${C.background}; color: ${C.foreground}; -webkit-font-smoothing: antialiased; }
.title { position: absolute; font: 400 72px/1 "Hanken Grotesk", sans-serif; letter-spacing: -0.03em; }
.line { position: absolute; font: 400 32px/50px Inconsolata, monospace; color: ${C.muted}; letter-spacing: -0.01em; }
.link { position: absolute; font: 400 30px/1 Inconsolata, monospace; color: ${C.accent}; border-bottom: 1.5px solid color-mix(in srgb, ${C.accent} 45%, transparent); padding-bottom: 6px; }
.cover { position: absolute; left: 40px; top: 40px; width: 1120px; height: 396px; border-radius: 16px; overflow: hidden; }
.cover img { display: block; width: 100%; height: 100%; }
.cover::after { content: ""; position: absolute; inset: 0; border-radius: 16px; box-shadow: inset 0 0 0 1px rgb(243 241 238 / 0.12); }
.logos { position: absolute; left: 84px; top: 96px; display: flex; gap: 14.6px; }
.logo { position: relative; width: 102px; height: 102px; border-radius: 50%; overflow: hidden; }
.logo img { display: block; width: 100%; height: 100%; }
.logo::after { content: ""; position: absolute; inset: 0; border-radius: 50%; box-shadow: inset 0 0 0 1.5px rgb(243 241 238 / 0.16); }
</style></head><body>${body}</body></html>`;

const src = (name) => `file://${join(SRC, name)}`;

const cards = [
  {
    out: "app/opengraph-image.png",
    html: page(`
<div class="logos">${Array.from({ length: 9 }, (_, i) => `<div class="logo"><img src="${src(`logo-${i + 1}.png`)}"></div>`).join("")}</div>
<p class="title" style="left:84px; top:406px">Kelvin Man</p>
<p class="line" style="left:84px; top:491px">Design engineer, Los Angeles</p>
<p class="link" style="right:84px; top:502px">kelvinman.com</p>`),
  },
  ...NOTES.map((n) => ({
    out: n.out,
    html: page(`
<p class="title" style="left:84px; top:96px">${n.title}</p>
<p class="line" style="left:84px; top:193px; width:1032px">${n.line}</p>
<p class="link" style="left:84px; top:502px">kelvinman.com</p>`),
  })),
  ...CASES.map((c) => ({
    out: `public/og/work-${c.slug}.png`,
    html: page(`
<div class="cover"><img src="${src(`cover-${c.slug}.png`)}"></div>
<p class="title" style="left:40px; top:464px">${c.title}</p>
<p class="line" style="left:40px; top:551px">${c.line}</p>`),
  })),
];

function chrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const cache = join(homedir(), "Library/Caches/ms-playwright");
  const shell = readdirSync(cache).filter((d) => d.startsWith("chromium_headless_shell-")).sort().pop();
  const bin = shell && join(cache, shell, "chrome-headless-shell-mac-arm64/chrome-headless-shell");
  if (!bin || !existsSync(bin)) throw new Error("No headless Chrome found. Set CHROME to one.");
  return bin;
}

const bin = chrome();
const dir = mkdtempSync(join(tmpdir(), "share-cards-"));
for (const card of cards) {
  const html = join(dir, "card.html");
  writeFileSync(html, card.html);
  execFileSync(bin, [
    "--headless",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    "--force-device-scale-factor=1",
    "--window-size=1200,630",
    "--virtual-time-budget=6000",
    `--screenshot=${join(ROOT, card.out)}`,
    `file://${html}`,
  ], { stdio: "ignore" });
  console.log(card.out);
}
