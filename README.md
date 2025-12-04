# 🌐 Universal Virtual Keyboard

A beautiful, multi-language virtual keyboard built with React, TypeScript, Ant Design, and Tailwind CSS. Type in any language on any website!

## Features

- ✅ **9 Language Support**: English, Hindi, Arabic, Spanish, French, German, Chinese, Japanese, and Russian
- ✅ **Beautiful UI**: Modern gradient design with smooth animations
- ✅ **Browser Extension**: Works on any website via Chrome/Edge extension
- ✅ **Responsive Design**: Works perfectly on desktop and mobile devices
- ✅ **Real-time Typing**: Type directly into any input field on web pages
- ✅ **Special Keys**: Backspace, Enter, Tab, Shift, Caps Lock, and more

## 🚀 Quick Start

### Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 📦 Browser Extension Setup

To use the virtual keyboard on any website:

1. **Build the extension**:
```bash
npm run build
```

2. **Copy built files to extension folder**:
   - Copy the built files from `dist/` to `extension/`
   - Or create a build script (see below)

3. **Load the extension in Chrome/Edge**:
   - Open Chrome/Edge and go to `chrome://extensions/` or `edge://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` folder

4. **Use the extension**:
   - Navigate to any website
   - Click the extension icon in the toolbar
   - Click "Toggle Keyboard" to show/hide the virtual keyboard
   - Click on any input field and start typing!

## 🎨 Supported Languages

- 🇺🇸 English (en)
- 🇮🇳 हिंदी / Hindi (hi)
- 🇸🇦 العربية / Arabic (ar)
- 🇪🇸 Español / Spanish (es)
- 🇫🇷 Français / French (fr)
- 🇩🇪 Deutsch / German (de)
- 🇨🇳 中文 / Chinese (zh)
- 🇯🇵 日本語 / Japanese (ja)
- 🇷🇺 Русский / Russian (ru)

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Ant Design** - UI components
- **Tailwind CSS** - Utility-first CSS framework

## 📁 Project Structure

```
virtualkeyboard/
├── src/
│   ├── components/
│   │   ├── VirtualKeyboard.tsx    # Main keyboard component
│   │   └── VirtualKeyboard.css     # Keyboard styles
│   ├── data/
│   │   └── layouts.ts              # Language keyboard layouts
│   ├── types/
│   │   └── keyboard.ts             # TypeScript types
│   ├── utils/
│   │   └── keyboardInput.ts       # Input handling utilities
│   ├── App.tsx                     # Main app component
│   └── main.tsx                    # Entry point
├── extension/                      # Browser extension files
│   ├── manifest.json              # Extension manifest
│   ├── content.js                 # Content script
│   ├── popup.html/js              # Extension popup
│   └── keyboard.html              # Keyboard iframe
└── package.json
```

## 🎯 Usage Examples

### Basic Usage

```tsx
import VirtualKeyboard from './components/VirtualKeyboard';

function App() {
  const handleKeyPress = (key: string) => {
    console.log('Key pressed:', key);
  };

  return (
    <VirtualKeyboard 
      onKeyPress={handleKeyPress}
      targetWebsite={false}
    />
  );
}
```

### Website Integration

```tsx
<VirtualKeyboard 
  onKeyPress={handleKeyPress}
  targetWebsite={true}  // Enables typing into focused inputs
/>
```

## 🔧 Customization

### Adding a New Language

1. Edit `src/data/layouts.ts`
2. Add your language layout following the existing pattern
3. Update `SupportedLanguage` type in `src/types/keyboard.ts`

### Styling

- Keyboard styles: `src/components/VirtualKeyboard.css`
- App styles: `src/App.css`
- Tailwind config: `tailwind.config.js`

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Made with ❤️ using React, TypeScript, and Ant Design
"# virtual_keyboard" 
