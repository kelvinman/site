"use client";

import { useId, useRef, useState } from "react";
import demo from "../../notes/demos/demos.module.css";
import styles from "./demos.module.css";

/**
 * Fabric Mapper, on real data: a sofa photo, the segments DecorX found on it, and a 37-inch
 * pagoda print, all from a test run in DecorX's own workspace on 16 Oct 2026. Pick the parts
 * to upholster, then drag to move the print within them. The fabric is laid over the photo's
 * own shading in the browser, a stand-in for the generated image the real tool produces.
 */
const WIDTH = 1408;
const HEIGHT = 590;
// The print repeats about every 37 inches; at this sofa's width that's roughly this many pixels.
const TILE = 520;

// Segments from the stored segmentation, mapped into the photo's pixels by fitting the stored sofa
// bounds onto the sofa's measured bounds in the photo. Legs and the wooden base are left out.
const SEGMENTS = [
  { part: "back corner", points: "125,105 123,110 121,117 121,143 123,146 125,147 145,147 159,151 170,158 176,163 180,168 183,169 183,162 178,150 174,130 172,126 170,122 169,113 166,105 163,102 131,102" },
  { part: "back corner", points: "1284,104 1282,102 1276,101 1250,101 1246,104 1241,117 1235,136 1235,142 1232,146 1230,150 1229,158 1230,163 1235,162 1235,160 1237,158 1241,155 1256,148 1261,147 1276,147 1284,146 1288,143 1289,143 1290,113 1288,106" },
  { part: "back cushion", points: "426,100 431,124 440,158 446,169 446,173 448,177 457,207 459,211 465,231 480,265 485,268 519,268 522,267 522,102 519,98 514,96 486,96" },
  { part: "back cushion", points: "991,98 987,98 954,96 948,98 915,94 913,94 899,94 890,100 888,105 890,267 892,268 926,267 939,243 948,221 954,211 969,173 971,164 973,160 977,147 978,138 988,113" },
  { part: "bolster", points: "1310,146 1292,144 1284,147 1260,148 1246,154 1233,162 1226,172 1224,180 1219,185 1207,215 1203,235 1203,261 1205,276 1215,286 1224,290 1241,302 1248,304 1261,308 1273,308 1289,300 1304,282 1312,268 1316,257 1325,229 1327,215 1332,197 1332,183 1329,167 1322,152" },
  { part: "bolster", points: "99,146 88,150 84,154 80,162 75,183 77,209 85,243 93,269 97,278 101,281 101,284 116,302 129,308 142,308 161,302 178,290 195,284 204,272 204,265 204,235 202,221 195,199 181,169 174,162 163,154 146,148 125,148 113,144" },
  { part: "arm", points: "1338,184 1333,188 1333,199 1318,259 1307,282 1293,302 1295,308 1305,314 1312,323 1312,379 1310,387 1303,394 1304,401 1312,411 1312,483 1316,487 1378,487 1383,480 1387,203 1386,197 1378,189 1363,185" },
  { part: "arm", points: "67,184 41,187 26,191 20,199 18,209 21,472 22,480 28,487 90,487 92,484 93,409 105,399 105,394 95,383 93,327 96,319 110,308 112,302 102,290 91,267 74,203 74,189" },
  { part: "pillow", points: "1016,41 1009,51 962,195 927,267 931,269 1069,273 1200,284 1203,223 1228,163 1237,122 1258,66 1260,47 1256,43 1241,43 1110,67 1030,41" },
  { part: "pillow", points: "152,45 153,63 187,175 204,223 204,281 208,284 319,273 469,269 480,267 469,246 437,152 411,53 405,42 391,41 309,68 264,57 170,41 156,41" },
  { part: "back cushion", points: "525,106 523,261 528,268 884,268 887,265 887,114 884,98 877,94 710,100 536,94 529,98" },
  { part: "seat", points: "92,343 97,385 129,401 1278,401 1308,386 1310,322 1290,308 1254,308 1204,288 922,270 532,269 260,280 189,289 146,308 118,308 99,320" },
  // The front rail under the seat cushion. The stored segmentation missed it, so this one is
  // traced by hand from the photo, and the caption says so.
  { part: "rail", points: "97,398 1311,398 1311,489 97,489" },
];

const PRESETS: { label: string; parts: string[] }[] = [
  { label: "Seat", parts: ["seat", "rail"] },
  { label: "Pillows", parts: ["pillow", "bolster"] },
  { label: "Whole sofa", parts: ["seat", "rail", "back cushion", "back corner", "arm", "pillow", "bolster"] },
];

export function FabricMapper() {
  const id = useId();
  const [selected, setSelected] = useState<Set<number>>(() => new Set(indexesOf(PRESETS[2].parts)));
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [outlines, setOutlines] = useState(false);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number; moved: boolean } | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  // The preset the chosen parts match exactly, if any; after clicking parts by hand, none is lit.
  const current = PRESETS.find((preset) => {
    const parts = indexesOf(preset.parts);
    return parts.length === selected.size && parts.every((i) => selected.has(i));
  })?.label;

  // Screen pixels to photo pixels, so a drag moves the print as far as the pointer moved.
  const scale = () => WIDTH / (svg.current?.getBoundingClientRect().width || WIDTH);

  const onDown = (event: React.PointerEvent) => {
    drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y, moved: false };
    (event.target as Element).setPointerCapture?.(event.pointerId);
  };
  const onMove = (event: React.PointerEvent) => {
    const start = drag.current;
    if (!start) return;
    const dx = (event.clientX - start.x) * scale();
    const dy = (event.clientY - start.y) * scale();
    if (Math.abs(dx) + Math.abs(dy) > 4) start.moved = true;
    if (start.moved) setOffset({ x: start.ox + dx, y: start.oy + dy });
  };
  const onUp = (index?: number) => {
    const start = drag.current;
    drag.current = null;
    // A click without a drag adds or removes that part.
    if (start && !start.moved && index !== undefined) {
      setSelected((current) => {
        const next = new Set(current);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
      });
    }
  };

  const clip = `${id}-clip`;
  const pattern = `${id}-print`;

  return (
    <figure className={demo.demo}>
      <svg
        ref={svg}
        className={styles.mapper}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="A sofa upholstered in a pagoda print"
        onPointerMove={onMove}
        onPointerLeave={() => onUp()}
      >
        <defs>
          <pattern
            id={pattern}
            width={TILE}
            height={TILE}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${offset.x} ${offset.y})`}
          >
            <image href="/work/decorx/swatch-pagoda.jpg" width={TILE} height={TILE} />
          </pattern>
          <clipPath id={clip}>
            {SEGMENTS.map((segment, index) =>
              selected.has(index) ? <polygon key={index} points={segment.points} /> : null,
            )}
          </clipPath>
        </defs>

        <image href="/work/decorx/sofa.png" width={WIDTH} height={HEIGHT} />

        {/* The print, multiplied over a brightened copy of the photo so the folds and shadows show through. */}
        <g clipPath={`url(#${clip})`} className={styles.fabric}>
          <image href="/work/decorx/sofa.png" width={WIDTH} height={HEIGHT} className={styles.shading} />
          <rect width={WIDTH} height={HEIGHT} fill={`url(#${pattern})`} className={styles.print} />
        </g>

        {SEGMENTS.map((segment, index) => (
          <polygon
            key={index}
            points={segment.points}
            className={styles.segment}
            data-outline={outlines || undefined}
            data-selected={selected.has(index) || undefined}
            onPointerDown={onDown}
            onPointerUp={() => onUp(index)}
          >
            <title>{segment.part}</title>
          </polygon>
        ))}
      </svg>

      <div className={demo.controls}>
        <div className={demo.toggle} role="group" aria-label="Parts">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              aria-pressed={preset.label === current}
              onClick={() => setSelected(new Set(indexesOf(preset.parts)))}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={outlines}
          className={demo.switch}
          onClick={() => setOutlines((value) => !value)}
        >
          <span className={demo.track}>
            <span className={demo.knob} />
          </span>
          Segments
        </button>
      </div>

      <figcaption className={demo.caption}>
        Click a part to add or remove it, drag to move the print. Real DecorX data, except the front rail, which I
        traced by hand.
      </figcaption>
    </figure>
  );
}

function indexesOf(parts: string[]) {
  return SEGMENTS.flatMap((segment, index) => (parts.includes(segment.part) ? [index] : []));
}
