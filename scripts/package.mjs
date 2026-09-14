/**
 * Packages ./out into fashionia-site.zip for drag-and-drop hosting (Netlify Drop).
 *
 * Written by hand because both PowerShell's Compress-Archive and .NET
 * Framework's ZipFile emit entry names with backslashes, which Linux hosts
 * read as flat filenames — every asset under _next/ then 404s. The ZIP spec
 * requires forward slashes, so this builds the archive directly, then
 * re-reads it to prove the nested structure survived.
 *
 * Usage: npm run package   (after `npm run build`)
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const SOURCE = path.resolve("out");
const OUTPUT = path.resolve("fashionia-site.zip");

if (!fs.existsSync(path.join(SOURCE, "index.html"))) {
  console.error("No ./out/index.html — run `npm run build` first.");
  process.exit(1);
}

/* ---- CRC-32 ---------------------------------------------------------- */
const CRC_TABLE = new Int32Array(256).map((_, i) => {
  let c = i;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});

function crc32(buffer) {
  let c = -1;
  for (const byte of buffer) c = (c >>> 8) ^ CRC_TABLE[(c ^ byte) & 0xff];
  return (c ^ -1) >>> 0;
}

/* ---- Walk ------------------------------------------------------------- */
function walk(dir, base = dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, base, files);
    else files.push({ full, name: path.relative(base, full).split(path.sep).join("/") });
  }
  return files;
}

function dosStamp(date) {
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1),
    day: ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

/* ---- Write ------------------------------------------------------------ */
const files = walk(SOURCE);
const localParts = [];
const centralParts = [];
let offset = 0;

for (const file of files) {
  const raw = fs.readFileSync(file.full);
  const deflated = zlib.deflateRawSync(raw, { level: 9 });
  const useDeflate = deflated.length < raw.length;
  const data = useDeflate ? deflated : raw;
  const method = useDeflate ? 8 : 0;
  const crc = crc32(raw);
  const nameBuf = Buffer.from(file.name, "utf8");
  const { time, day } = dosStamp(fs.statSync(file.full).mtime);

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0, 6);
  local.writeUInt16LE(method, 8);
  local.writeUInt16LE(time, 10);
  local.writeUInt16LE(day, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(data.length, 18);
  local.writeUInt32LE(raw.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  local.writeUInt16LE(0, 28);
  localParts.push(local, nameBuf, data);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0, 8);
  central.writeUInt16LE(method, 10);
  central.writeUInt16LE(time, 12);
  central.writeUInt16LE(day, 14);
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(data.length, 20);
  central.writeUInt32LE(raw.length, 24);
  central.writeUInt16LE(nameBuf.length, 28);
  central.writeUInt16LE(0, 30);
  central.writeUInt16LE(0, 32);
  central.writeUInt16LE(0, 34);
  central.writeUInt16LE(0, 36);
  central.writeUInt32LE(0, 38);
  central.writeUInt32LE(offset, 42);
  centralParts.push(central, nameBuf);

  offset += local.length + nameBuf.length + data.length;
}

const centralBuf = Buffer.concat(centralParts);
const eocd = Buffer.alloc(22);
eocd.writeUInt32LE(0x06054b50, 0);
eocd.writeUInt16LE(0, 4);
eocd.writeUInt16LE(0, 6);
eocd.writeUInt16LE(files.length, 8);
eocd.writeUInt16LE(files.length, 10);
eocd.writeUInt32LE(centralBuf.length, 12);
eocd.writeUInt32LE(offset, 16);
eocd.writeUInt16LE(0, 20);

fs.writeFileSync(OUTPUT, Buffer.concat([...localParts, centralBuf, eocd]));

/* ---- Verify by reading the central directory back ----------------------- */
const zip = fs.readFileSync(OUTPUT);
let eocdAt = zip.length - 22;
while (zip.readUInt32LE(eocdAt) !== 0x06054b50) eocdAt--;
const count = zip.readUInt16LE(eocdAt + 10);
let cursor = zip.readUInt32LE(eocdAt + 16);
const names = [];
for (let i = 0; i < count; i++) {
  const nameLength = zip.readUInt16LE(cursor + 28);
  const extraLength = zip.readUInt16LE(cursor + 30);
  const commentLength = zip.readUInt16LE(cursor + 32);
  names.push(zip.toString("utf8", cursor + 46, cursor + 46 + nameLength));
  cursor += 46 + nameLength + extraLength + commentLength;
}

const backslashes = names.filter((name) => name.includes("\\")).length;
const nested = names.filter((name) => name.startsWith("_next/static/")).length;

console.log(`wrote ${path.basename(OUTPUT)} — ${count} entries, ${(zip.length / 1024).toFixed(0)} KB`);
console.log(`nested _next/static entries: ${nested}, backslash entries: ${backslashes}`);

if (backslashes > 0 || nested === 0) {
  console.error("Archive structure is wrong — do not upload it.");
  process.exit(1);
}
