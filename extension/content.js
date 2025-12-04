// Content script that injects the virtual keyboard into web pages

let keyboardFrame = null;
let isKeyboardVisible = false;

function createKeyboardFrame() {
  // Remove existing keyboard if any
  if (keyboardFrame) {
    keyboardFrame.remove();
  }

  // Create iframe for the keyboard
  keyboardFrame = document.createElement('iframe');
  keyboardFrame.id = 'virtual-keyboard-frame';
  keyboardFrame.src = chrome.runtime.getURL('keyboard.html');
  keyboardFrame.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 400px;
    border: none;
    z-index: 999999;
    background: white;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
    display: none;
  `;

  document.body.appendChild(keyboardFrame);
}

function toggleKeyboard() {
  if (!keyboardFrame) {
    createKeyboardFrame();
  }

  isKeyboardVisible = !isKeyboardVisible;
  keyboardFrame.style.display = isKeyboardVisible ? 'block' : 'none';

  // Send message to keyboard iframe
  if (isKeyboardVisible) {
    keyboardFrame.contentWindow.postMessage({ type: 'init', targetWebsite: true }, '*');
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleKeyboard') {
    toggleKeyboard();
    sendResponse({ success: true });
  }
});

// Listen for keyboard events from iframe
window.addEventListener('message', (event) => {
  // Security: verify origin - allow messages from extension origin
  const extensionOrigin = chrome.runtime.getURL('').slice(0, -1);
  if (event.origin !== extensionOrigin && !event.origin.startsWith('chrome-extension://')) {
    return;
  }

  if (event.data && event.data.type === 'keyPress') {
    console.log('Content script: Received key:', event.data.key, 'Type:', typeof event.data.key);
    const activeElement = document.activeElement;
    
    if (!activeElement) return;

    // Handle different input types
    if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
      const start = activeElement.selectionStart || 0;
      const end = activeElement.selectionEnd || 0;
      const value = activeElement.value;

      if (event.data.key === 'Backspace') {
        if (start === end && start > 0) {
          activeElement.value = value.substring(0, start - 1) + value.substring(start);
          activeElement.setSelectionRange(start - 1, start - 1);
        } else if (start !== end) {
          activeElement.value = value.substring(0, start) + value.substring(end);
          activeElement.setSelectionRange(start, start);
        }
      } else if (event.data.key === 'Enter') {
        const newValue = value.substring(0, start) + '\n' + value.substring(end);
        activeElement.value = newValue;
        activeElement.setSelectionRange(start + 1, start + 1);
      } else if (event.data.key === 'Tab') {
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        activeElement.value = newValue;
        activeElement.setSelectionRange(start + 2, start + 2);
      } else {
        // Regular character - event.data.key contains the actual character to insert
        // (e.g., Hindi character, not the English key code)
        const charToInsert = event.data.key;
        const newValue = value.substring(0, start) + charToInsert + value.substring(end);
        activeElement.value = newValue;
        activeElement.setSelectionRange(start + charToInsert.length, start + charToInsert.length);
      }

      // Trigger events
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      activeElement.dispatchEvent(new Event('change', { bubbles: true }));
    } else if (activeElement.isContentEditable) {
      // Handle contentEditable elements
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        if (event.data.key === 'Backspace') {
          if (range.collapsed) {
            range.setStart(range.startContainer, Math.max(0, range.startOffset - 1));
          }
          range.deleteContents();
        } else {
          // Insert the actual character (e.g., Hindi character)
          range.deleteContents();
          const charToInsert = event.data.key; // This is the display character
          const textNode = document.createTextNode(charToInsert);
          range.insertNode(textNode);
          range.setStartAfter(textNode);
          range.collapse(true);
        }
        
        selection.removeAllRanges();
        selection.addRange(range);
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }
});

// Initialize keyboard frame when page loads
if (document.body) {
  createKeyboardFrame();
} else {
  window.addEventListener('DOMContentLoaded', createKeyboardFrame);
}

