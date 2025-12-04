// Popup script for the extension

let isKeyboardVisible = false;

const toggleBtn = document.getElementById('toggleBtn');
const statusEl = document.getElementById('status');

if (!toggleBtn || !statusEl) {
  console.error('Required elements not found in popup');
} else {
  toggleBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.id) {
        statusEl.textContent = 'Error: Could not access tab';
        return;
      }

      // Check if it's a special page where content scripts can't run
      if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('chrome-extension://'))) {
        statusEl.textContent = 'Error: Cannot run on this page';
        return;
      }

      chrome.tabs.sendMessage(tab.id, { action: 'toggleKeyboard' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          statusEl.textContent = 'Error: Please refresh the page and try again';
          return;
        }
        
        isKeyboardVisible = !isKeyboardVisible;
        statusEl.textContent = 
          isKeyboardVisible ? 'Keyboard is visible ✓' : 'Keyboard is hidden';
      });
    } catch (error) {
      console.error('Error:', error);
      statusEl.textContent = 'Error: ' + error.message;
    }
  });
}

