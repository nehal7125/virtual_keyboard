# Browser Extension Setup

This folder contains the browser extension files for the Universal Virtual Keyboard.

## Installation Steps

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Copy extension files** (if using the build script):
   ```bash
   npm run build:extension
   ```

3. **Load the extension in Chrome/Edge**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Or open Edge and navigate to `edge://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select this `extension` folder

4. **Use the extension**:
   - Navigate to any website
   - Click the extension icon in your browser toolbar
   - Click "Toggle Keyboard" to show/hide the virtual keyboard
   - Click on any input field and start typing with the virtual keyboard!

## Files Structure

- `manifest.json` - Extension configuration
- `content.js` - Script that runs on web pages to inject the keyboard
- `content.css` - Styles for the keyboard frame
- `popup.html/js` - Extension popup interface
- `keyboard.html` - Keyboard iframe (will be generated from build)

## Notes

- The extension requires the built files from `dist/` to be copied to this folder
- Make sure to update `keyboard.html` to point to the correct built JavaScript files
- Icons are placeholders - replace with actual icon files for production

