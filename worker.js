// Sends the bare domain and plain http to https://www so the site has one address, keeps case studies behind a shared
// password or a mentor's own expiring one, then serves the static export.

// Case studies hold client work, so they need the password. The /work index stays public.
const CASE_STUDIES = ["/work/decorx", "/work/mirascope", "/work/moment", "/work/sidecar-legal", "/work/wethos"];
const COOKIE = "case_studies";
const MONTH = 60 * 60 * 24 * 30;
// A mentor's password, made by scripts/mentor-password.mjs. It reads like any password: 16 letters and
// digits holding a random part, the last day (UTC, masked) and a signature by MENTOR_KEY.
const LETTERS = "0123456789abcdefghjkmnpqrstvwxyz";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // The bare domain, and plain http on www, both go to https://www, so Google sees one copy of each page.
    if (url.hostname === env.BARE_HOST || (url.hostname === env.CANONICAL_HOST && url.protocol === "http:")) {
      url.protocol = "https:";
      url.hostname = env.CANONICAL_HOST;
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === "/unlock" && request.method === "POST") return unlock(request, env, url);
    if (isCaseStudy(url.pathname) && !(await hasAccess(request, env))) {
      return lockedPage(url.pathname, false, await shareTags(request, env, url.pathname));
    }
    return env.ASSETS.fetch(request);
  },
};

/** The page itself, its exported variants (.html, .txt) and everything under it, like its videos. */
function isCaseStudy(path) {
  return CASE_STUDIES.some((base) => path === base || path.startsWith(`${base}/`) || path.startsWith(`${base}.`));
}

/** The cookie is a signature of the current password, so changing the password locks everyone out again. */
async function token(password) {
  return hmac(password, "kelvinman case studies");
}

async function hmac(secret, message) {
  return hex(await hmacBytes(secret, message));
}

async function hmacBytes(secret, message) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message)));
}

function hex(bytes) {
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** A typed mentor password as its 16 letters, forgiving case, dashes, spaces and look-alikes. */
function mentorLetters(password) {
  const text = password.toLowerCase().replace(/[\s-]/g, "").replace(/o/g, "0").replace(/[il]/g, "1");
  return /^[0-9a-hjkmnp-tv-z]{16}$/.test(text) ? text : "";
}

/**
 * Seconds left on a mentor's password, or 0 when it is wrong or over. Nothing is stored: the
 * signature proves the date came from the script, and changing MENTOR_KEY ends them all.
 */
async function mentorSecondsLeft(letters, env) {
  if (!env.MENTOR_KEY || !letters) return 0;
  let bits = 0n;
  for (const c of letters) bits = (bits << 5n) | BigInt(LETTERS.indexOf(c));
  const bytes = Array.from({ length: 10 }, (_, i) => Number((bits >> BigInt(8 * (9 - i))) & 255n));
  const nonce = hex(bytes.slice(0, 3));
  const mask = await hmacBytes(env.MENTOR_KEY, `mask ${nonce}`);
  const day = ((bytes[3] ^ mask[0]) << 8) | (bytes[4] ^ mask[1]);
  const expected = hex((await hmacBytes(env.MENTOR_KEY, `mentor ${nonce} ${day}`)).slice(0, 5));
  if (!same(hex(bytes.slice(5)), expected)) return 0;
  return Math.max(0, Math.floor(((day + 1) * 864e5 - Date.now()) / 1000));
}

/** Compares without stopping at the first difference, so timing says nothing about the secret. */
function same(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hasAccess(request, env) {
  const cookie = (request.headers.get("Cookie") || "").split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  if (!cookie) return false;
  const value = cookie.slice(COOKIE.length + 1);
  // A mentor's cookie holds their password, so it is checked, and runs out, the same way.
  if (value.startsWith("m.")) return (await mentorSecondsLeft(mentorLetters(value.slice(2)), env)) > 0;
  // Without a password configured, stay locked rather than open.
  if (!env.CASE_STUDY_PASSWORD) return false;
  return same(value, await token(env.CASE_STUDY_PASSWORD));
}

async function unlock(request, env, url) {
  const form = await request.formData();
  const password = String(form.get("password") || "");
  // Only send people back to a case study, never to another site.
  const next = String(form.get("next") || "");
  const target = isCaseStudy(next) ? next : "/work";
  let value, maxAge;
  const letters = mentorLetters(password);
  const mentorLeft = await mentorSecondsLeft(letters, env);
  if (mentorLeft > 0) {
    value = `m.${letters}`;
    maxAge = Math.min(mentorLeft, MONTH);
  } else if (env.CASE_STUDY_PASSWORD && same(password, env.CASE_STUDY_PASSWORD)) {
    value = await token(env.CASE_STUDY_PASSWORD);
    maxAge = MONTH;
  } else {
    return lockedPage(target, true, await shareTags(request, env, target));
  }
  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL(target, url).toString(),
      "Set-Cookie": `${COOKIE}=${value}; Path=/work; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`,
    },
  });
}

/**
 * The case study's own link preview tags (og: and twitter:), copied from its exported page, so a
 * link shared in a message shows its card even though the page itself needs the password.
 */
async function shareTags(request, env, path) {
  const res = await env.ASSETS.fetch(new URL(path.split("/").slice(0, 3).join("/"), request.url));
  if (!res.ok) return "";
  return ((await res.text()).match(/<meta (?:property="og:|name="twitter:)[^>]*>/g) || []).join("\n");
}

/**
 * The page asking for the password, set like the top of the case study it stands in for: the way back
 * to Work, the case study's name and one line about it, then the password. Same fonts, colours and
 * column as the rest of the site. The name and line come from the case study's own share tags. The
 * password shows as it is typed, since it is a shared code handed out, not a secret of the visitor's.
 */
function lockedPage(next, wrong, tags = "") {
  const meta = (key) => (tags.match(new RegExp(`property="og:${key}" content="([^"]*)"`)) || [])[1] || "";
  const name = meta("title").split(" · ")[0] || "Case study";
  const about = meta("description");
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#1c1a18">
<meta name="robots" content="noindex, nofollow">
<title>${escape(name)} · Kelvin Man</title>
${tags}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400&family=Inconsolata:wght@400;500&display=swap">
<style>
:root { --background: #1c1a18; --foreground: #f3f1ee; --muted: #a39d96; --accent: #e48a62; --read: "Hanken Grotesk", system-ui, sans-serif; color-scheme: dark; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { min-height: 100vh; display: grid; grid-template-columns: minmax(0, 440px); justify-content: center; align-content: start; padding: 100px 24px; background: var(--background); color: var(--foreground); font: 14px/21px Inconsolata, Menlo, monospace; letter-spacing: -0.01em; -webkit-font-smoothing: antialiased; }
@media (max-width: 600px) { body { font-size: 15px; line-height: 23px; } }
a { color: var(--accent); text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--accent) 40%, transparent); text-underline-offset: 2px; }
.back { color: var(--muted); text-decoration: none; margin-bottom: 40px; justify-self: start; }
@media (min-width: 1128px) {
  /* The same three columns as a case study, with the way back in the left one, out toward the edge. */
  body { grid-template-columns: 180px minmax(0, 440px) 180px; column-gap: 112px; }
  .back { margin: -16px 0 0 max(-48px, calc(84px - (100vw - 1024px) / 2)); }
}
.back:hover { color: var(--foreground); }
main { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }
h1 { font: inherit; }
.muted { color: var(--muted); }
.read { font-family: var(--read); }
form { display: flex; gap: 8px; width: 100%; margin-top: 8px; }
input { flex: 1; min-width: 0; font: inherit; font-size: 16px; line-height: 22px; padding: 8px 12px; border: 1px solid color-mix(in srgb, var(--muted) 35%, transparent); border-radius: 8px; background: color-mix(in srgb, var(--muted) 6%, transparent); color: var(--foreground); }
input::placeholder { color: var(--muted); }
input:focus { outline: none; border-color: var(--accent); }
button { font: inherit; font-weight: 500; padding: 8px 16px; border: 0; border-radius: 8px; background: var(--foreground); color: var(--background); cursor: pointer; }
button:hover { opacity: 0.88; }
button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.error { color: var(--accent); }
</style>
</head>
<body>
<a class="back" href="/work">← Work</a>
<main>
<header>
<h1>${escape(name)}</h1>
<p class="muted">Case study</p>
</header>
<p class="muted" aria-hidden="true">—</p>
${about ? `<p class="read">${about}</p>` : ""}
<p class="read">It shows client work, so it's shared with a password. If you don't have it, email <a href="mailto:hello@kelvinman.com">hello@kelvinman.com</a>.</p>
<form method="post" action="/unlock">
<input type="text" name="password" aria-label="Password" placeholder="Password" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" autofocus required>
<input type="hidden" name="next" value="${escape(next)}">
<button type="submit">Open</button>
</form>
${wrong ? '<p class="error" role="alert">That password didn\'t work.</p>' : ""}
</main>
</body>
</html>`;
  return new Response(html, {
    // 200 rather than 401 for the first view, since link previews skip pages that refuse them.
    status: wrong ? 401 : 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

function escape(value) {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
