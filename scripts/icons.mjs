// Renders the site's icons in the dark palette: a terracotta dot on the page colour, as app/icon.png
// (512), app/apple-icon.png (180) and app/favicon.ico (32, a PNG inside an ICO).
//
//   node scripts/icons.mjs
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const sharp = createRequire(import.meta.url)("sharp");

// The dot is 300/512 of the square, as before.
const svg = (size) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
<rect width="512" height="512" fill="#1c1a18"/><circle cx="256" cy="256" r="150" fill="#e48a62"/></svg>`);

const png = (size) => sharp(svg(size)).png().toBuffer();

writeFileSync(`${ROOT}app/icon.png`, await png(512));
writeFileSync(`${ROOT}app/apple-icon.png`, await png(180));

// An ICO holding one 32px PNG: a 6-byte header, one 16-byte entry, then the image.
const ico = await png(32);
const head = Buffer.alloc(22);
head.writeUInt16LE(0, 0); // reserved
head.writeUInt16LE(1, 2); // icon
head.writeUInt16LE(1, 4); // one image
head.writeUInt8(32, 6); // width
head.writeUInt8(32, 7); // height
head.writeUInt8(0, 8); // no palette
head.writeUInt8(0, 9); // reserved
head.writeUInt16LE(1, 10); // planes
head.writeUInt16LE(32, 12); // bits per pixel
head.writeUInt32LE(ico.length, 14); // image size
head.writeUInt32LE(22, 18); // image offset
writeFileSync(`${ROOT}app/favicon.ico`, Buffer.concat([head, ico]));
console.log("icons done");
