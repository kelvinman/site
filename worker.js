// Sends the bare domain to www so the site has one address, then serves the static export.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === env.BARE_HOST) {
      url.protocol = "https:";
      url.hostname = env.CANONICAL_HOST;
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
