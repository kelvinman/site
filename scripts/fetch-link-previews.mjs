// Runs before every build (npm's prebuild). Finds every outbound link written in app/, and for each
// one without a preview in public/peek/ yet, fetches the og:image from the page it points to, resizes
// it and saves it there. Notes get an image from inside them, further down.
// app/link-previews.json maps each link to its image, for LinkPeek. The site
// is a static export, so the browser never fetches another site's page. It never fails the build: a
// site that is down or blocks the request just has no preview this time. An image saved into
// public/peek/ by hand, under the link's slug, is kept and used like a fetched one. Figma's,
// Meta's and Left Field Labs' are, because their bot checks turn away scripts; Snap's and
// Microsoft's are screenshots of their home pages, because neither sets an og:image. Mirascope's
// (its home page hero) and Wethos' (its wordmark on its purple) replace share images that showed a
// product screen rather than the company. Adapted from Founding Designers' fetch-share-images.mjs.
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const TIMEOUT = 8000;
const APP = new URL("../app/", import.meta.url);
const DIR = new URL("../public/peek/", import.meta.url);
const MANIFEST = new URL("../app/link-previews.json", import.meta.url);
// Links back to this site get no preview, and nor do my own profiles: a card of me beside my own
// name says nothing.
const SELF = /^https?:\/\/(www\.)?kelvinman\.com/;
const PROFILES = new Set(["https://github.com/kelvinman", "https://linkedin.com/in/0xkelvin", "https://x.com/0xkelvin"]);

const slugOf = (href) => {
  const url = new URL(href);
  return `${url.hostname}${url.pathname}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
};

async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(TIMEOUT), redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}

function ogImage(html, base) {
  const tag = html.match(/<meta[^>]+(?:property|name)=["'](?:og:image(?::url)?|twitter:image)["'][^>]*>/i)?.[0];
  const content = tag?.match(/content=["']([^"']+)["']/i)?.[1];
  // Figma writes its slashes as &#47;.
  const decoded = content?.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n)).replace(/&amp;/g, "&");
  return decoded ? new URL(decoded, base).href : null;
}

async function fetchOne(href, file) {
  const res = await get(href);
  const src = ogImage(await res.text(), res.url);
  if (!src) return "no og:image";
  const image = Buffer.from(await (await get(src)).arrayBuffer());
  await sharp(image).resize({ width: 640, withoutEnlargement: true }).jpeg({ quality: 78 }).toFile(file.pathname);
  return "saved";
}

// Every https link written as an href in app/: in JSX (href="…") and in data files (href: "…").
const hrefs = new Set(
  readdirSync(APP, { recursive: true })
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .flatMap((f) => [...readFileSync(new URL(f, APP), "utf8").matchAll(/href[=:]\s*["'](https:\/\/[^"']+)["']/g)].map((m) => m[1]))
    .filter((href) => !SELF.test(href) && !PROFILES.has(href)),
);

mkdirSync(DIR, { recursive: true });
const fileOf = (href) => new URL(`${slugOf(href)}.jpg`, DIR);
const todo = [...hrefs].filter((href) => !existsSync(fileOf(href)));

const results = await Promise.all(
  todo.map((href) =>
    fetchOne(href, fileOf(href))
      .then((r) => `${href}: ${r}`)
      .catch((e) => `${href}: skipped (${e.message.slice(0, 60)})`),
  ),
);
console.log(`Link previews: ${todo.length} missing.${results.length ? "\n  " + results.join("\n  ") : ""}`);

// Notes link within the site, so their preview is the image each one names as `peek` in
// app/notes/notes.ts, or failing that its own share image. Remade every build, so an edited image
// never goes stale. A tall image, like a phone, sits whole in the middle of a plain card
// rather than being cropped to a strip.
const W = 640;
const H = 336;
const NOTES = new URL("notes/", APP);
const PUBLIC = new URL("../public/", import.meta.url);
const listed = [...readFileSync(new URL("notes.ts", NOTES), "utf8").matchAll(/slug: "([^"]+)"(?:[^}]*?peek: "\/([^"]+)")?[^}]*}/g)];
const notes = listed
  .map(([, slug, peek]) => ({ slug, src: peek ? new URL(peek, PUBLIC) : new URL(`${slug}/opengraph-image.png`, NOTES) }))
  .filter(({ src }) => existsSync(src));

async function noteCard(src, out) {
  const { width, height } = await sharp(src.pathname).metadata();
  if (width / height > 1.4) return sharp(src.pathname).resize(W, H, { fit: "cover" }).jpeg({ quality: 78 }).toFile(out);
  const front = await sharp(src.pathname).resize({ height: H - 40 }).toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = front.info;
  const corners = Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="14"/></svg>`);
  const rounded = await sharp(front.data).composite([{ input: corners, blend: "dest-in" }]).png().toBuffer();
  return sharp({ create: { width: W, height: H, channels: 3, background: "#e9e6e1" } })
    .composite([{ input: rounded, gravity: "center" }])
    .jpeg({ quality: 78 })
    .toFile(out);
}
await Promise.all(notes.map(({ slug, src }) => noteCard(src, new URL(`notes-${slug}.jpg`, DIR).pathname)));

// Case studies use their share card from public/og/, cropped to the hover card's shape.
const work = readdirSync(new URL("og/", PUBLIC))
  .map((file) => file.match(/^work-(.+)\.png$/)?.[1])
  .filter(Boolean);
await Promise.all(
  work.map((slug) =>
    sharp(new URL(`og/work-${slug}.png`, PUBLIC).pathname).resize(W, H, { fit: "cover", position: "top" }).jpeg({ quality: 80 }).toFile(new URL(`work-${slug}.jpg`, DIR).pathname),
  ),
);

// A note links to a project at its entry on /work (app/Mention.tsx), so that link uses the entry's cover.
const entries = readFileSync(new URL("work/projects.ts", APP), "utf8")
  .split(/\n    slug: "/)
  .slice(1)
  .map((chunk) => ({ slug: chunk.slice(0, chunk.indexOf('"')), cover: chunk.match(/\n    cover: \{\s*src: "\/([^"]+)"/)?.[1] }))
  .filter(({ cover }) => cover && existsSync(new URL(cover, PUBLIC)));
await Promise.all(
  entries.map(({ slug, cover }) =>
    sharp(new URL(cover, PUBLIC).pathname).resize(W, H, { fit: "cover" }).jpeg({ quality: 78 }).toFile(new URL(`entry-${slug}.jpg`, DIR).pathname),
  ),
);

const manifest = Object.fromEntries([
  ...[...hrefs]
    .sort()
    .filter((href) => existsSync(fileOf(href)))
    .map((href) => [href, `/peek/${slugOf(href)}.jpg`]),
  ...notes.map(({ slug }) => [`/notes/${slug}`, `/peek/notes-${slug}.jpg`]),
  ...work.map((slug) => [`/work/${slug}`, `/peek/work-${slug}.jpg`]),
  ...entries.map(({ slug }) => [`/work#${slug}`, `/peek/entry-${slug}.jpg`]),
]);
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
