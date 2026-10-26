// The Logos's Eye from The Last Apostate, drawn the way the game draws it: every pixel
// decided by a formula of distance and angle from the centre, so the same rules redraw it
// at any size. Ported from scripts/generate-cathedral-sprites.mjs in that repo.

const C = {
  ink: "#181425",
  wood0: "#3f2832",
  gold0: "#b86f50",
  gold1: "#e4a672",
  cream: "#ead4aa",
  blood3: "#e43b44",
  white: "#ffffff",
};

/** A size × size grid of colours (null is empty), with an optional one-pixel ink outline. */
export function eyeSeal(size: number, outline = true): (string | null)[] {
  const px: (string | null)[] = new Array(size * size).fill(null);
  const k = size / 96;
  const c = size / 2 - 0.5;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = x - c;
      const dy = y - c;
      const r = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      let color: string | null = null;
      // Sixteen thin rays, widest near the ring.
      const ray = Math.sin(angle * 8);
      if (r > 30 * k && r < 47 * k && Math.abs(ray) > 0.9 - ((47 * k - r) / k) * 0.004) color = r < 38 * k ? C.gold1 : C.gold0;
      if (r <= 30 * k) color = r > 28.6 * k ? C.ink : r > 26.5 * k ? C.gold0 : C.wood0;
      const lidH = 12 * k * Math.cos(Math.min(Math.PI / 2, (Math.abs(dx) / (24 * k)) * (Math.PI / 2)));
      if (r < 26 * k && Math.abs(dy) < lidH) color = C.cream;
      if (r < 26 * k && Math.abs(dx) < 24 * k && Math.abs(Math.abs(dy) - lidH) < 1) color = C.ink;
      if (r < 9 * k && Math.abs(dy) < lidH) color = r > 7.8 * k ? C.ink : r > 3.4 * k ? C.blood3 : C.ink;
      if (Math.hypot(dx + 2.5 * k, dy + 2.5 * k) < 1.5 * Math.max(1, k)) color = C.white;
      px[y * size + x] = color;
    }
  }
  if (!outline) return px;
  // Ink on every empty pixel that touches a coloured one, like the game's sprite sheet.
  const at = (x: number, y: number) => (x < 0 || y < 0 || x >= size || y >= size ? null : px[y * size + x]);
  const edges: number[] = [];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (at(x, y)) continue;
      const touches = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].some(([ox, oy]) => {
        const n = at(x + ox, y + oy);
        return n && n !== C.ink;
      });
      if (touches) edges.push(y * size + x);
    }
  }
  for (const i of edges) px[i] = C.ink;
  return px;
}
