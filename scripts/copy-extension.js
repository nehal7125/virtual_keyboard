import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Copy built files to extension directory
const distDir = path.join(rootDir, 'dist');
const extensionDir = path.join(rootDir, 'extension');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory not found. Run "npm run build:extension:only" first.');
  process.exit(1);
}

// Create extension directory if it doesn't exist
if (!fs.existsSync(extensionDir)) {
  fs.mkdirSync(extensionDir, { recursive: true });
}

console.log('Copying extension files...');

// Copy keyboard.html from extension folder (it's already there)
const keyboardHtmlSrc = path.join(rootDir, 'extension', 'keyboard.html');
const keyboardHtmlDest = path.join(extensionDir, 'keyboard.html');
if (fs.existsSync(keyboardHtmlSrc)) {
  fs.copyFileSync(keyboardHtmlSrc, keyboardHtmlDest);
  console.log('✓ Copied keyboard.html');
} else {
  console.warn('⚠ keyboard.html not found, creating basic version...');
  const basicHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Virtual Keyboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: white; height: 100vh; overflow: hidden; }
    #root { height: 100%; display: flex; flex-direction: column; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./keyboard.js"></script>
</body>
</html>`;
  fs.writeFileSync(keyboardHtmlDest, basicHtml);
}

// Copy keyboard.js from dist
const keyboardJsSrc = path.join(distDir, 'keyboard.js');
const keyboardJsDest = path.join(extensionDir, 'keyboard.js');
if (fs.existsSync(keyboardJsSrc)) {
  fs.copyFileSync(keyboardJsSrc, keyboardJsDest);
  console.log('✓ Copied keyboard.js');
} else {
  console.error('✗ keyboard.js not found in dist! Make sure you ran "npm run build:extension:only"');
  process.exit(1);
}

// Copy assets directory
const assetsSrc = path.join(distDir, 'assets');
const assetsDest = path.join(extensionDir, 'assets');
if (fs.existsSync(assetsSrc)) {
  copyRecursiveSync(assetsSrc, assetsDest);
  console.log('✓ Copied assets directory');
} else {
  console.warn('⚠ Assets directory not found');
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('\n✓ Extension files copied successfully!');
console.log('You can now load the extension from the extension/ folder in Chrome/Edge.');
