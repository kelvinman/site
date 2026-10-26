import type { MetadataRoute } from "next";
import { NOTES } from "./notes/notes";

export const dynamic = "force-static";

/** The home page and every note, for search engines. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.kelvinman.com/" },
    ...NOTES.map((note) => ({ url: `https://www.kelvinman.com/notes/${note.slug}`, lastModified: note.date })),
  ];
}
