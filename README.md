# kelvinman.com

My personal site: who I am, where I've worked, and notes on things I've built.

Live at [kelvinman.com](https://www.kelvinman.com).

## What's in it

- **Home:** a short intro, a work list, and the notes.
- **Notes:** longer pieces with live demos inside them.
  - [The thinking I kept](https://www.kelvinman.com/notes/the-thinking-i-kept): on making [The Last Apostate](https://github.com/kelvinman/the-last-apostate). It has a recording of the game playing itself, a chart of who made what, and the game's Eye redrawn from its rule as you drag its size.
  - [Under the glass](https://www.kelvinman.com/notes/under-the-glass): getting a full-screen hero under the status bar and toolbar in iOS Safari 26, with a recording from the iPhone simulator in a drawn iPhone frame.

## How it's built

- **Next.js** (App Router), exported as static HTML (`output: "export"`) and served from Cloudflare Workers static assets. Every push to `main` deploys.
- **Two typefaces, one job each.** Sentences are set in Hanken Grotesk; everything around them (names, dates, labels, captions, code) is Inconsolata.
- **CSS Modules**, no UI library. Colours are a handful of variables in `app/globals.css`, with a dark mode.
- **Motion that stays out of the way.** Pages fade up as they load, demos play only while on screen, and everything holds still under `prefers-reduced-motion`.
- **Icons and link previews** are plain files in `app/` (`icon.png`, `apple-icon.png`, `opengraph-image.png`), which Next.js picks up on its own.

## Layout

```
app/
  page.tsx              the home page
  work.ts               the work list
  notes/
    notes.ts            every note, newest first
    NoteLayout.tsx      a note's page, with the contents rail
    CodeBlock.tsx       code with a small highlighter and a copy button
    demos/              the demos used inside notes
    <slug>/page.tsx     one note
```

## Running it

```bash
npm install
npm run dev
```

`npm run build` writes the static site to `out/`.

## Writing a note

Add an entry to `app/notes/notes.ts`, then a folder in `app/notes/` with a `page.tsx` that uses `NoteLayout` and `NoteHeader`. An `opengraph-image.png` in the same folder becomes its link preview.
