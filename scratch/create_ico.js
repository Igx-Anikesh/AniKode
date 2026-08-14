// Helper script to convert the logo to a proper ICO file
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createIco() {
  const projectRoot = path.join(__dirname, '..');
  const inputPath = path.join(projectRoot, 'assets', 'anikode_logo.png');
  const outputIco = path.join(projectRoot, 'assets', 'anikode_logo.ico');
  const outputPng = path.join(projectRoot, 'assets', 'anikode_logo_256.png');
  
  // First convert to a clean 256x256 PNG
  await sharp(inputPath)
    .resize(256, 256)
    .png()
    .toFile(outputPng);
  
  // Read the resized PNG
  const pngData = fs.readFileSync(outputPng);
  
  // Create ICO file structure (simple single-image ICO)
  // ICO header: 6 bytes
  // ICO directory entry: 16 bytes
  // PNG image data follows
  
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);  // Reserved
  header.writeUInt16LE(1, 2);  // Type: 1 = ICO
  header.writeUInt16LE(1, 4);  // Number of images: 1
  
  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(0, 0);       // Width: 0 = 256
  dirEntry.writeUInt8(0, 1);       // Height: 0 = 256
  dirEntry.writeUInt8(0, 2);       // Color palette: 0
  dirEntry.writeUInt8(0, 3);       // Reserved
  dirEntry.writeUInt16LE(1, 4);    // Color planes
  dirEntry.writeUInt16LE(32, 6);   // Bits per pixel
  dirEntry.writeUInt32LE(pngData.length, 8);  // Image data size
  dirEntry.writeUInt32LE(22, 12);  // Offset to image data (6 + 16 = 22)
  
  const icoBuffer = Buffer.concat([header, dirEntry, pngData]);
  fs.writeFileSync(outputIco, icoBuffer);
  
  // Clean up intermediate file
  fs.unlinkSync(outputPng);
  
  console.log(`ICO file created: ${outputIco} (${(icoBuffer.length / 1024).toFixed(1)} KB)`);
}

createIco().catch(err => {
  console.error('Failed to create ICO:', err.message);
  process.exit(1);
});
