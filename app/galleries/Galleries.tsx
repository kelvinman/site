import styles from "./galleries.module.css";
import { Lift } from "./Lift";
import { Views } from "./Views";
import type { Photo, Visit } from "./Print";
import about from "./artists.json";

// One line about each artist's work, written from the wall labels and press sheets Kelvin
// photographed or the show's own listing. Artists without one show only where they were seen.
const ABOUT: Record<string, string> = about;

export type { Photo, Visit };

const month = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" });

/** A room's prints, hung level. Each can be picked up; `where` is the line shown under it then. */
function Hang({ items }: { items: { photo: Photo; where: string }[] }) {
  return (
    <div className={styles.hang}>
      {items.map(({ photo, where }) => (
        <Lift key={photo.src} photo={photo} where={where} />
      ))}
    </div>
  );
}

/** Where a work was seen: the show (and its dates, when known), the place and the month. */
function seenAt(photo: Photo, visit: Visit) {
  const show = photo.show ?? visit.show;
  const runs = photo.runs ?? visit.runs;
  return [show && (runs ? `${show} (${runs})` : show), visit.venue, month(visit.date)].filter(Boolean).join(", ");
}

/**
 * Each artist is a room, A to Z, opening with their name as wall text and where their work was
 * seen. Only photos with an artist named appear. Kelvin chose this as the main view, 13 Nov 2026.
 */
function ByArtist({ visits }: { visits: Visit[] }) {
  const artists = new Map<string, { photo: Photo; visit: Visit }[]>();
  for (const visit of visits)
    for (const photo of visit.photos)
      for (const artist of photo.artists) artists.set(artist, [...(artists.get(artist) ?? []), { photo, visit }]);

  return (
    <div className={styles.rooms}>
      {[...artists.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([artist, seen]) => (
          <section key={artist} className={styles.room}>
            <header className={styles.wallText}>
              <h2 className={styles.venue}>{artist}</h2>
              <p className={styles.meta}>{[...new Set(seen.map(({ photo, visit }) => seenAt(photo, visit)))].join(" · ")}</p>
              {ABOUT[artist] && <p className={styles.about}>{ABOUT[artist]}</p>}
            </header>
            {/* The room already names the artist, so their prints carry only the work. */}
            <Hang
              items={seen.map(({ photo, visit }) => ({
                photo: { ...photo, artists: [] },
                where: [artist, visit.venue, month(visit.date)].filter(Boolean).join(", "),
              }))}
            />
          </section>
        ))}
    </div>
  );
}

/**
 * Each visit is a room, newest first: what Kelvin saw on one day at one place, credited or not.
 * The show names the room; a visit with no name yet goes by its date until Kelvin names it.
 * Asked for on 13 Nov 2026 ("usually same date would be same exhibition").
 */
function ByExhibition({ visits }: { visits: Visit[] }) {
  const day = (date: string) =>
    new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return (
    <div className={styles.rooms}>
      {[...visits]
        .filter((v) => v.photos.length)
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((visit) => {
          const title = visit.show ?? visit.venue ?? day(visit.date);
          // Shows hung inside one visit (MOCA's two, say) are named on the prints' pill instead.
          const inside = [...new Map(visit.photos.filter((p) => p.show).map((p) => [p.show!, p.link])).entries()];
          // Only the day Kelvin went, not the dates the show is on view (24 Nov 2026).
          const meta = [visit.show && visit.venue, title === day(visit.date) ? null : day(visit.date)].filter(Boolean);
          return (
            <section key={visit.slug} className={styles.room}>
              <header className={styles.wallText}>
                <h2 className={styles.venue}>{visit.link ? <Out href={visit.link}>{title}</Out> : title}</h2>
                <p className={styles.meta}>
                  {meta.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                  {inside.map(([show, link]) => (
                    <span key={show}>{link ? <Out href={link}>{show}</Out> : show}</span>
                  ))}
                </p>
              </header>
              <Hang
                items={visit.photos.map((photo) => ({
                  photo,
                  where: [photo.show && photo.show !== title ? photo.show : null, visit.venue, month(visit.date)].filter(Boolean).join(", "),
                }))}
              />
            </section>
          );
        })}
    </div>
  );
}

/** A link to the show's own page, opening in a new tab. */
function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className={styles.out} target="_blank" rel="noopener noreferrer">
      {children}
      <span aria-hidden> ↗</span>
    </a>
  );
}

/** The page: the prints by artist, or by exhibition. */
export function Galleries({ visits }: { visits: Visit[] }) {
  return <Views views={{ "by-artist": <ByArtist visits={visits} />, "by-exhibition": <ByExhibition visits={visits} /> }} />;
}
