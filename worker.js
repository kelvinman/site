// Sends the bare domain to www so the site has one address, keeps case studies behind a shared
// password, then serves the static export.

// Case studies hold client work, so they need the password. The /work index stays public.
const CASE_STUDIES = ["/work/decorx", "/work/mirascope", "/work/moment", "/work/sidecar-legal", "/work/wethos"];
const COOKIE = "case_studies";
const MONTH = 60 * 60 * 24 * 30;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === env.BARE_HOST) {
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
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("kelvinman case studies"));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Compares without stopping at the first difference, so timing says nothing about the secret. */
function same(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hasAccess(request, env) {
  // Without a password configured, stay locked rather than open.
  if (!env.CASE_STUDY_PASSWORD) return false;
  const cookie = (request.headers.get("Cookie") || "").split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  if (!cookie) return false;
  return same(cookie.slice(COOKIE.length + 1), await token(env.CASE_STUDY_PASSWORD));
}

async function unlock(request, env, url) {
  const form = await request.formData();
  const password = String(form.get("password") || "");
  // Only send people back to a case study, never to another site.
  const next = String(form.get("next") || "");
  const target = isCaseStudy(next) ? next : "/work";
  if (!env.CASE_STUDY_PASSWORD || !same(password, env.CASE_STUDY_PASSWORD)) return lockedPage(target, true);
  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL(target, url).toString(),
      "Set-Cookie": `${COOKIE}=${await token(env.CASE_STUDY_PASSWORD)}; Path=/work; Max-Age=${MONTH}; HttpOnly; Secure; SameSite=Lax`,
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

/** A small page in the site's colours asking for the password. */
function lockedPage(next, wrong, tags = "") {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Case study · Kelvin Man</title>
${tags}
<style>
:root { --background: #f8f7f4; --foreground: #1f1b18; --muted: #77706a; --accent: #b0502c; color-scheme: light dark; }
@media (prefers-color-scheme: dark) { :root { --background: #1c1a18; --foreground: #f3f1ee; --muted: #a39d96; --accent: #e48a62; } }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { min-height: 100vh; display: flex; justify-content: center; padding: 100px 24px; background: var(--background); color: var(--foreground); font: 14px/21px Menlo, ui-monospace, monospace; }
main { width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 16px; }
p { font-family: system-ui, sans-serif; font-size: 15px; line-height: 23px; }
.muted { color: var(--muted); }
a { color: var(--accent); }
form { display: flex; gap: 8px; }
input { flex: 1; min-width: 0; font: inherit; font-size: 16px; padding: 8px 10px; border: 1px solid color-mix(in srgb, var(--muted) 45%, transparent); border-radius: 6px; background: transparent; color: var(--foreground); }
button { font: inherit; padding: 8px 14px; border: 0; border-radius: 6px; background: var(--foreground); color: var(--background); cursor: pointer; }
.error { color: var(--accent); font-size: 13px; }
</style>
</head>
<body>
<main>
<p class="muted"><a href="/work">← Work</a></p>
<h1 style="font: inherit">Case study</h1>
<p>This one shows client work, so it's shared with a password. If you don't have it, email <a href="mailto:hello@kelvinman.com">hello@kelvinman.com</a>.</p>
<form method="post" action="/unlock">
<input type="password" name="password" aria-label="Password" placeholder="Password" autocomplete="current-password" autofocus required>
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
