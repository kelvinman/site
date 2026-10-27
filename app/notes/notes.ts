/** Every note on the site, newest first. Each one has its own page under app/notes/. `peek` is an
 * image from inside the note, in public/, shown when the pointer is over a link to it. */
export const NOTES = [
  {
    slug: "the-thinking-i-kept",
    title: "The thinking I kept",
    date: "2026-10-25",
    summary: "On making The Last Apostate, a game about how much of your thinking you've handed over.",
    peek: "/notes/the-last-apostate-cycle.jpg",
  },
  {
    slug: "under-the-glass",
    title: "Under the glass",
    date: "2026-10-25",
    summary: "How to make a full-screen hero run under the status bar and toolbar in iOS Safari 26.",
    peek: "/notes/mymind-safari.jpg",
  },
];

export type Note = (typeof NOTES)[number];

/** "Oct 2026", in LA time, the way the rest of the site writes dates. */
export const formatNoteDate = (date: string) =>
  new Date(`${date}T12:00:00-07:00`).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });
