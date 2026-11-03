// Makes a case study password for one mentor that stops working after a set number of days.
// It reads like any password, so nothing tells them it is theirs alone or that it runs out.
//
//   node scripts/mentor-password.mjs         good for 14 days
//   node scripts/mentor-password.mjs 30      good for 30 days
//   node scripts/mentor-password.mjs setup   once, or again to end every mentor password
//
// Nothing is stored per mentor. The password holds its last day, masked and signed with
// MENTOR_KEY, which lives in the macOS Keychain here and as a Worker secret on Cloudflare.
import { createHmac, randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";

const SERVICE = "kelvinman-site-mentor-key";
const LETTERS = "0123456789abcdefghjkmnpqrstvwxyz";

function readKey() {
  try {
    return execFileSync("security", ["find-generic-password", "-s", SERVICE, "-w"], { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

/** A new key in the Keychain and on the Worker. Every mentor password made before stops working. */
function setup() {
  const key = randomBytes(32).toString("hex");
  execFileSync("security", ["add-generic-password", "-U", "-a", "site", "-s", SERVICE, "-w", key]);
  execFileSync("npx", ["wrangler", "secret", "put", "MENTOR_KEY"], { input: key, stdio: ["pipe", "inherit", "inherit"] });
  console.log("New mentor key saved to the Keychain and the Worker. Older mentor passwords no longer work.");
}

const hmac = (key, message) => createHmac("sha256", key).update(message).digest();

export function make(key, days, now = Date.now()) {
  const day = Math.floor(now / 864e5) + days;
  const nonce = randomBytes(3);
  const mask = hmac(key, `mask ${nonce.toString("hex")}`);
  const sig = hmac(key, `mentor ${nonce.toString("hex")} ${day}`).subarray(0, 5);
  const bytes = Buffer.concat([nonce, Buffer.from([(day >> 8) ^ mask[0], (day & 255) ^ mask[1]]), sig]);
  let bits = BigInt(`0x${bytes.toString("hex")}`);
  let letters = "";
  for (let i = 0; i < 16; i++, bits >>= 5n) letters = LETTERS[Number(bits & 31n)] + letters;
  return { password: letters.match(/.{4}/g).join("-"), last: new Date(day * 864e5).toISOString().slice(0, 10) };
}

const [arg = "14"] = process.argv.slice(2);
if (import.meta.url === `file://${process.argv[1]}`) {
  if (arg === "setup") setup();
  else {
    const key = readKey();
    if (!key) throw new Error("No mentor key yet. Run: node scripts/mentor-password.mjs setup");
    const { password, last } = make(key, Number(arg));
    console.log(password);
    console.log(`Works through ${last} (UTC). Only you see this date.`);
  }
}
