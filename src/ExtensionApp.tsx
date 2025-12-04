import { useEffect } from 'react';
import VirtualKeyboard from './components/VirtualKeyboard';
import { ConfigProvider } from 'antd';

export default function ExtensionApp() {
  useEffect(() => {
    // Listen for init message from content script
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'init') {
        // Keyboard is initialized, ready to use
        console.log('Virtual keyboard initialized in extension mode');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleKeyPress = (key: string) => {
    // Send key press to parent window (content script)
    // The keyboard is in an iframe, so we send to parent
    // 'key' parameter contains the actual character to insert (display character)
    console.log('ExtensionApp: Sending key:', key, 'Type:', typeof key, 'Length:', key.length);
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'keyPress',
          key: key, // This is the display character (e.g., Hindi character, not 's')
        },
        '*' // In extension context, we need to allow cross-origin
      );
    }
  };

  return (
    <ConfigProvider>
      <div style={{ height: '100%', overflow: 'auto', background: 'white' }}>
        <VirtualKeyboard 
          onKeyPress={handleKeyPress} 
          targetWebsite={false} // Don't try to access parent document, use postMessage instead
        />
      </div>
    </ConfigProvider>
  );
}

