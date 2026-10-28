"use client";

import { useEffect, useId, useRef, useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./demos.module.css";

/**
 * Fabric Mapper, on real data: a sofa photo, the segments DecorX found on it, and a 37-inch
 * pagoda print, all from a test run in DecorX's own workspace on 16 Oct 2026. First the photo is
 * scanned into parts. Then you pick one part and drag to place the print on it, and generate:
 * the rest of the sofa fills in from that placement. The fabric is laid over the photo's own
 * shading in the browser, a stand-in for the generated image the real tool produces.
 */
const WIDTH = 1408;
const HEIGHT = 590;
// The print repeats every 37 inches; at this sofa's width that's roughly 520 photo pixels.
const REPEAT_IN = 37;
const PX_PER_IN = 520 / REPEAT_IN;

// Segments from the stored segmentation, mapped into the photo's pixels by fitting the stored sofa
// bounds onto the sofa's measured bounds in the photo. Legs and the wooden base are left out.
const SEGMENTS = [
  {
    part: "back corner",
    points:
      "125,105 123,110 121,117 121,143 123,146 125,147 145,147 159,151 170,158 176,163 180,168 183,169 183,162 178,150 174,130 172,126 170,122 169,113 166,105 163,102 131,102",
  },
  {
    part: "back corner",
    points:
      "1284,104 1282,102 1276,101 1250,101 1246,104 1241,117 1235,136 1235,142 1232,146 1230,150 1229,158 1230,163 1235,162 1235,160 1237,158 1241,155 1256,148 1261,147 1276,147 1284,146 1288,143 1289,143 1290,113 1288,106",
  },
  {
    part: "back cushion",
    points:
      "426,100 431,124 440,158 446,169 446,173 448,177 457,207 459,211 465,231 480,265 485,268 519,268 522,267 522,102 519,98 514,96 486,96",
  },
  {
    part: "back cushion",
    points:
      "991,98 987,98 954,96 948,98 915,94 913,94 899,94 890,100 888,105 890,267 892,268 926,267 939,243 948,221 954,211 969,173 971,164 973,160 977,147 978,138 988,113",
  },
  {
    part: "bolster",
    points:
      "1310,146 1292,144 1284,147 1260,148 1246,154 1233,162 1226,172 1224,180 1219,185 1207,215 1203,235 1203,261 1205,276 1215,286 1224,290 1241,302 1248,304 1261,308 1273,308 1289,300 1304,282 1312,268 1316,257 1325,229 1327,215 1332,197 1332,183 1329,167 1322,152",
  },
  {
    part: "bolster",
    points:
      "99,146 88,150 84,154 80,162 75,183 77,209 85,243 93,269 97,278 101,281 101,284 116,302 129,308 142,308 161,302 178,290 195,284 204,272 204,265 204,235 202,221 195,199 181,169 174,162 163,154 146,148 125,148 113,144",
  },
  {
    part: "arm",
    points:
      "1338,184 1333,188 1333,199 1318,259 1307,282 1293,302 1295,308 1305,314 1312,323 1312,379 1310,387 1303,394 1304,401 1312,411 1312,483 1316,487 1378,487 1383,480 1387,203 1386,197 1378,189 1363,185",
  },
  {
    part: "arm",
    points:
      "67,184 41,187 26,191 20,199 18,209 21,472 22,480 28,487 90,487 92,484 93,409 105,399 105,394 95,383 93,327 96,319 110,308 112,302 102,290 91,267 74,203 74,189",
  },
  {
    part: "pillow",
    points:
      "1016,41 1009,51 962,195 927,267 931,269 1069,273 1200,284 1203,223 1228,163 1237,122 1258,66 1260,47 1256,43 1241,43 1110,67 1030,41",
  },
  {
    part: "pillow",
    points:
      "152,45 153,63 187,175 204,223 204,281 208,284 319,273 469,269 480,267 469,246 437,152 411,53 405,42 391,41 309,68 264,57 170,41 156,41",
  },
  {
    part: "back cushion",
    points: "525,106 523,261 528,268 884,268 887,265 887,114 884,98 877,94 710,100 536,94 529,98",
  },
  {
    part: "seat",
    points:
      "92,343 97,385 129,401 1278,401 1308,386 1310,322 1290,308 1254,308 1204,288 922,270 532,269 260,280 189,289 146,308 118,308 99,320",
  },
  // The front rail under the seat cushion. The stored segmentation missed it, so this one is
  // traced by hand from the photo, and the caption says so.
  { part: "rail", points: "97,398 1311,398 1311,489 97,489" },
];

// Each segment's centre and left edge, for the order things appear in.
const SHAPES = SEGMENTS.map((segment) => {
  const pts = segment.points.split(" ").map((pair) => pair.split(",").map(Number));
  const xs = pts.map(([x]) => x);
  return {
    left: Math.min(...xs),
    cx: xs.reduce((a, b) => a + b, 0) / pts.length,
    cy: pts.reduce((a, [, y]) => a + y, 0) / pts.length,
  };
});
const SEAT = SEGMENTS.findIndex((segment) => segment.part === "seat");
// How long the scan takes to cross the photo, and how long the rest of the sofa takes to fill in.
const SCAN_MS = 1400;
// The swatch sizes on offer, in inches across one repeat of the print.
const MIN_IN = 18;
const MAX_IN = 72;
const FILL_MS = 1500;

type Stage = "photo" | "scanning" | "placing" | "generating" | "done";

export function FabricMapper() {
  const id = useId();
  const [stage, setStage] = useState<Stage>("photo");
  const [selected, setSelected] = useState(SEAT);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  // The swatch's size, in inches across one repeat. It starts at the print's real 37.
  const [inches, setInches] = useState(REPEAT_IN);
  const tile = inches * PX_PER_IN;
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (stage !== "scanning" && stage !== "generating") return;
    const timer = setTimeout(
      () => setStage(stage === "scanning" ? "placing" : "done"),
      stage === "scanning" ? SCAN_MS : FILL_MS,
    );
    return () => clearTimeout(timer);
  }, [stage]);

  // Screen pixels to photo pixels, so a drag moves the print as far as the pointer moved.
  const scale = () => WIDTH / (svg.current?.getBoundingClientRect().width || WIDTH);

  // Pressing on a part picks it, and dragging moves the print within it.
  const onDown = (event: React.PointerEvent, index: number) => {
    if (stage !== "placing") return;
    setSelected(index);
    drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
    (event.target as Element).setPointerCapture?.(event.pointerId);
  };
  const onMove = (event: React.PointerEvent) => {
    const start = drag.current;
    if (!start) return;
    setOffset({ x: start.ox + (event.clientX - start.x) * scale(), y: start.oy + (event.clientY - start.y) * scale() });
  };
  const onUp = () => {
    drag.current = null;
  };

  const segmented = stage !== "photo" && stage !== "scanning";
  const filled = stage === "generating" || stage === "done";
  // The rest of the sofa fills in outward from the part you placed, nearest first.
  const from = SHAPES[selected];
  const reach = Math.max(...SHAPES.map((s) => Math.hypot(s.cx - from.cx, s.cy - from.cy)));
  const fillDelay = (index: number) =>
    (Math.hypot(SHAPES[index].cx - from.cx, SHAPES[index].cy - from.cy) / reach) * (FILL_MS - 600);

  const next = {
    photo: { label: "Find the parts", go: () => setStage("scanning") },
    scanning: { label: "Scanning…", go: undefined },
    placing: { label: "Generate", go: () => setStage("generating") },
    generating: { label: "Generating…", go: undefined },
    done: {
      label: "Try again",
      go: () => {
        setStage("photo");
        setSelected(SEAT);
        setOffset({ x: 0, y: 0 });
        setInches(REPEAT_IN);
      },
    },
  }[stage];

  return (
    <figure className={demo.demo}>
      <svg
        ref={svg}
        className={styles.mapper}
        data-stage={stage}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={
          stage === "done"
            ? "The sofa, upholstered in a pagoda print from one placement"
            : segmented
              ? `A sofa split into its parts, with the pagoda print placed on the ${SEGMENTS[selected].part}`
              : "A sofa photo"
        }
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        <defs>
          <pattern
            id={`${id}-print`}
            width={tile}
            height={tile}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${offset.x} ${offset.y})`}
          >
            <image href="/work/decorx/swatch-pagoda.jpg" width={tile} height={tile} />
          </pattern>
          {SEGMENTS.map((segment, index) => (
            <clipPath key={index} id={`${id}-clip-${index}`}>
              <polygon points={segment.points} />
            </clipPath>
          ))}
          <linearGradient id={`${id}-scan`} x1="0" x2="1">
            <stop offset="0" style={{ stopColor: "var(--accent)", stopOpacity: 0 }} />
            <stop offset="0.85" style={{ stopColor: "var(--accent)", stopOpacity: 0.25 }} />
            <stop offset="1" style={{ stopColor: "var(--accent)", stopOpacity: 0.9 }} />
          </linearGradient>
        </defs>

        <image href="/work/decorx/sofa.png" width={WIDTH} height={HEIGHT} />

        {/* Each part's print, multiplied over a brightened copy of the photo so the folds and shadows show through. */}
        {SEGMENTS.map((segment, index) => {
          const mine = index === selected;
          const shown = segmented && (mine || filled);
          return (
            <g
              key={index}
              clipPath={`url(#${id}-clip-${index})`}
              className={styles.fabric}
              data-shown={shown || undefined}
              data-generated={(filled && !mine) || undefined}
              style={{ transitionDelay: filled && !mine ? `${fillDelay(index)}ms` : undefined }}
            >
              <image href="/work/decorx/sofa.png" width={WIDTH} height={HEIGHT} className={styles.shading} />
              <rect width={WIDTH} height={HEIGHT} fill={`url(#${id}-print)`} className={styles.print} />
            </g>
          );
        })}

        {stage === "scanning" ? (
          <rect
            className={styles.scan}
            x={-240}
            width={240}
            height={HEIGHT}
            fill={`url(#${id}-scan)`}
            style={{ animationDuration: `${SCAN_MS}ms` }}
          />
        ) : null}

        {SEGMENTS.map((segment, index) => (
          <polygon
            key={index}
            points={segment.points}
            className={styles.segment}
            data-outline={stage === "scanning" || stage === "placing" || undefined}
            data-active={(stage === "placing" && index === selected) || undefined}
            style={{
              transitionDelay: stage === "scanning" ? `${(SHAPES[index].left / WIDTH) * SCAN_MS}ms` : undefined,
            }}
            onPointerDown={(event) => onDown(event, index)}
          >
            <title>{segment.part}</title>
          </polygon>
        ))}
      </svg>

      <div className={demo.controls}>
        {stage === "placing" ? (
          <label className={demo.range}>
            Swatch size
            <input
              type="range"
              className={demo.slider}
              min={MIN_IN}
              max={MAX_IN}
              step={1}
              value={inches}
              onChange={(event) => setInches(Number(event.target.value))}
              style={{ "--fill": `${((inches - MIN_IN) / (MAX_IN - MIN_IN)) * 100}%` } as React.CSSProperties}
            />
            <span className={demo.value}>{inches} in</span>
          </label>
        ) : null}
        <button type="button" className={demo.quiet} disabled={!next.go} onClick={next.go}>
          {next.label}
        </button>
      </div>

      <figcaption className={demo.caption}>
        Pick a part of the sofa and drag the swatch to where you want it. Set the swatch size, then generate the rest of
        the sofa from that placement. It&apos;s real DecorX data, except the front rail, which I traced by hand.
      </figcaption>
    </figure>
  );
}
