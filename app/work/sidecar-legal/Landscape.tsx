import demo from "../../notes/demos/demos.module.css";
import styles from "./landscape.module.css";

/**
 * The 22 legal drafting tools on his "Competitive research" page in the studio Notion (May 2025), most of them
 * Word add-ins, sorted onto two axes from what each tool's own site says. Sidecar's place, litigators at small
 * firms, is the founders' positioning, paraphrased.
 */
/** Each tool and its site icon in /work/sidecar-legal/logos, fetched from the tool's own site on 11 Nov 2026.
 * No icon where no official site could be confirmed; those get a letter instead. */
const TOOLS: [string, string?][] = [
  ["GC AI for Word", "gc-ai"],
  ["BoostDraft", "boostdraft"],
  ["DeepIP", "deepip"],
  ["Ironclad Jurist", "ironclad"],
  ["Ketrone Draft"],
  ["Centari", "centari"],
  ["DraftPro", "ebrevia"],
  ["LexIQ"],
  ["ArrowLex AI", "arrowlex"],
  ["DraftWise", "draftwise"],
  ["SmartContract AI"],
  ["Aracor AI", "aracor"],
  ["MikeLegal", "mikelegal"],
  ["FirstRead"],
  ["AllDrafts"],
  ["DraftPilot", "draftpilot"],
  ["Brackets AI", "brackets"],
  ["Lexis Create+", "lexisnexis"],
  ["Lexis Create DMS", "lexisnexis"],
  ["Gavel Exec", "gavel"],
  ["Spellbook", "spellbook"],
  ["Harvey Assistant", "harvey"],
];

/** The tool's icon, or its first letter where no official site could be confirmed. */
function Mark({ name, logo, size = 20 }: { name: string; logo?: string; size?: number }) {
  return logo ? (
    // eslint-disable-next-line @next/next/no-img-element -- static export, tiny icons
    <img
      className={styles.logo}
      src={`/work/sidecar-legal/logos/${logo}.png`}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
    />
  ) : (
    <span className={styles.letter} style={{ width: size, height: size, fontSize: size * 0.5 }} aria-hidden="true">
      {name[0]}
    </span>
  );
}

/**
 * Where each tool says it sits, from its own site's title and description (read 11 Nov 2026), so nothing is
 * placed on a guess. Columns: what it's for. Rows: who it says it serves. Tools whose sites are general,
 * about something else (patents), or could not be read sit unplaced underneath. ArrowLex says "expert
 * litigation" without naming firms or in-house, so it sits in the not-stated row.
 */
type Spot = { name: string; logo?: string; note?: string; us?: boolean };
const MAP: Record<"firms" | "unstated" | "inhouse", { contracts: Spot[]; litigation: Spot[] }> = {
  firms: {
    contracts: [
      { name: "Spellbook", logo: "spellbook" },
      { name: "Centari", logo: "centari" },
      { name: "Harvey", logo: "harvey", note: "also litigation" },
    ],
    litigation: [{ name: "Sidecar", note: "small firms", us: true }],
  },
  unstated: {
    contracts: [
      { name: "Ironclad", logo: "ironclad" },
      { name: "DraftPro", logo: "ebrevia" },
      { name: "DraftWise", logo: "draftwise" },
      { name: "Aracor", logo: "aracor" },
      { name: "Gavel", logo: "gavel" },
    ],
    litigation: [{ name: "ArrowLex", logo: "arrowlex" }],
  },
  inhouse: {
    contracts: [{ name: "DraftPilot", logo: "draftpilot" }],
    litigation: [],
  },
};
const PLACED = new Set(["Spellbook", "Centari", "Harvey Assistant", "Ironclad Jurist", "DraftPro", "DraftWise", "Aracor AI", "Gavel Exec", "ArrowLex AI", "DraftPilot"]);

const ROWS: ["firms" | "unstated" | "inhouse", string][] = [
  ["firms", "Law firms"],
  ["unstated", "Not stated"],
  ["inhouse", "In-house teams"],
];

function Chip({ s }: { s: Spot }) {
  return (
    <li className={styles.chip} data-us={s.us || undefined}>
      <Mark name={s.name} logo={s.logo} size={18} />
      <span>
        {s.name}
        {s.note && <em> · {s.note}</em>}
      </span>
    </li>
  );
}

function MapView() {
  return (
    <div className={styles.map}>
      <span className={styles.corner} />
      <span className={styles.colHead}>Contracts and deals</span>
      <span className={styles.colHead} data-us>
        Litigation
      </span>
      {ROWS.map(([key, label]) => (
        <div key={key} className={styles.mapRow}>
          <span className={styles.rowHead}>{label}</span>
          <ul className={styles.cell}>
            {MAP[key].contracts.map((s) => (
              <Chip key={s.name} s={s} />
            ))}
          </ul>
          <ul className={styles.cell} data-col="litigation">
            {MAP[key].litigation.map((s) => (
              <Chip key={s.name} s={s} />
            ))}
          </ul>
        </div>
      ))}
      <div className={styles.unplaced}>
        <span className={styles.rowHead}>General or other</span>
        <ul>
          {TOOLS.filter(([t]) => !PLACED.has(t)).map(([t, logo]) => (
            <li key={t} title={t}>
              <Mark name={t} logo={logo} size={18} />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Landscape() {
  return (
    <figure className={demo.demo}>
      <MapView />
      <figcaption className={demo.caption}>
        The 22 legal drafting tools I compared, sorted by what each one&apos;s own site says it&apos;s for and who
        it serves. Of the ones I could place, all but one are for contracts.
      </figcaption>
    </figure>
  );
}
