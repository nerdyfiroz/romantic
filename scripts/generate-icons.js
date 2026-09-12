const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const iconsDir = path.join(__dirname, '..', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Function to generate a simple RGBA PNG without external dependencies
function createPng(width, height, isMaskable) {
  // RGBA buffer
  const rowBytes = width * 4;
  const rawData = Buffer.alloc(height * (rowBytes + 1));

  const centerX = width / 2;
  const centerY = height / 2;
  const scale = width / (isMaskable ? 40 : 32);

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      // Calculate normalized coords relative to center
      const nx = (x - centerX) / scale;
      const ny = -(y - (centerY - scale * 0.5)) / scale; // Flip Y for standard cartesian

      // Heart curve equation: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
      const a = nx * nx + ny * ny - 1;
      const isInsideHeart = (a * a * a - nx * nx * ny * ny * ny) <= 0;

      // Distance from center for radial dark background
      const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      const maxDist = width * 0.5;

      if (isInsideHeart) {
        // Glowing Pink/Red Heart
        rawData[offset++] = 255; // R
        rawData[offset++] = 45;  // G
        rawData[offset++] = 95;  // B
        rawData[offset++] = 255; // Alpha
      } else {
        // Deep Romantic Vignette Background
        const bgFactor = Math.min(1, dist / maxDist);
        rawData[offset++] = Math.round(18 * (1 - bgFactor * 0.7)); // R
        rawData[offset++] = Math.round(9 * (1 - bgFactor * 0.7));  // G
        rawData[offset++] = Math.round(26 * (1 - bgFactor * 0.7)); // B
        rawData[offset++] = 255; // Alpha
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // Helper to build chunk
  function buildChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);

    const typeBuf = Buffer.from(type);
    const body = Buffer.concat([typeBuf, data]);

    const crcBuf = Buffer.alloc(4);
    const crcVal = crc32(body);
    crcBuf.writeUInt32BE(crcVal >>> 0, 0);

    return Buffer.concat([length, body, crcBuf]);
  }

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // Compression
  ihdrData.writeUInt8(0, 11); // Filter
  ihdrData.writeUInt8(0, 12); // Interlace
  const ihdrChunk = buildChunk('IHDR', ihdrData);

  // IDAT Chunk
  const idatChunk = buildChunk('IDAT', deflated);

  // IEND Chunk
  const iendChunk = buildChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 implementation
function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1));
      }
      table[i] = c >>> 0;
    }
    crc32.table = table;
  }

  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Generate all needed Android PWA icons
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192.png'), createPng(192, 192, true));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), createPng(512, 512, true));

console.log('Successfully generated all Android PWA icons in /icons!');
