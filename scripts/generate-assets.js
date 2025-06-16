const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../assets');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Create a base icon (purple checkmark on dark background)
async function createBaseIcon(size) {
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#121212"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size/2.5}" fill="#BB86FC" opacity="0.1"/>
      <path d="M${size/3} ${size/2} L${size/2.2} ${size/1.5} L${size/1.5} ${size/3}" 
            stroke="#BB86FC" 
            stroke-width="${size/20}" 
            fill="none" 
            stroke-linecap="round" 
            stroke-linejoin="round"/>
    </svg>
  `;

  return sharp(Buffer.from(svg))
    .png()
    .toBuffer();
}

// Generate all required assets
async function generateAssets() {
  try {
    // Generate app icon (1024x1024)
    const iconBuffer = await createBaseIcon(1024);
    await sharp(iconBuffer)
      .resize(1024, 1024)
      .toFile(path.join(ASSETS_DIR, 'icon.png'));

    // Generate adaptive icon (1024x1024)
    await sharp(iconBuffer)
      .resize(1024, 1024)
      .toFile(path.join(ASSETS_DIR, 'adaptive-icon.png'));

    // Generate favicon (48x48)
    await sharp(iconBuffer)
      .resize(48, 48)
      .toFile(path.join(ASSETS_DIR, 'favicon.png'));

    // Generate splash screen (1242x2436)
    const splashBuffer = await createBaseIcon(1242);
    await sharp(splashBuffer)
      .resize(1242, 2436)
      .toFile(path.join(ASSETS_DIR, 'splash.png'));

    console.log('✅ Assets generated successfully!');
  } catch (error) {
    console.error('Error generating assets:', error);
  }
}

generateAssets(); 