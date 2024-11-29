// background.js

// When the extension is installed or updated, set default font if not already set
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('selectedFont', (data) => {
    if (!data.selectedFont) {
      chrome.storage.sync.set({ selectedFont: 'script' }); // Set default font
      console.log('Default font set to "script"');
    } else {
      console.log('Font already set to:', data.selectedFont);
    }
  });
});

// Toggle wireframe and font when the extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  console.log('Extension icon clicked, toggling wireframe and font.');
  if (tab.id) {
    // Toggle wireframe and font when the icon is clicked
    toggleWireframe(tab);

    // Toggle font class
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: toggleFont
    });
  } else {
    console.error('Tab ID is undefined.');
  }
});

// Function to toggle the wireframe styles (grayscale, borders)
function toggleWireframe(tab) {
  chrome.storage.sync.get('wireframeEnabled', (data) => {
    const isWireframeEnabled = data.wireframeEnabled;
    console.log('Wireframe enabled:', isWireframeEnabled);

    if (isWireframeEnabled) {
      // Remove the wireframe styles (grayscale)
      chrome.scripting.removeCSS({
        target: { tabId: tab.id },
        files: ['CSS/styles.css']
      });
      chrome.storage.sync.set({ wireframeEnabled: false });
      console.log("Wireframe CSS removed.");
    } else {
      // Inject the wireframe styles (grayscale)
      chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['CSS/styles.css']
      });
      chrome.storage.sync.set({ wireframeEnabled: true });
      console.log("Wireframe CSS injected.");
    }
  });
}

// The toggleFont function to toggle the font style (Redacted Script or Standard)
function toggleFont() {
  const body = document.body;
  if (body) {
    chrome.storage.sync.get('selectedFont', (data) => {
      const selectedFont = data.selectedFont || 'script'; // Default to 'script' if none is selected
      const fontClass = selectedFont === 'standard' ? 'redacted-standard' : 'redacted-script';

      console.log('Toggling font class:', fontClass);
      if (body.classList.contains(fontClass)) {
        // If the font class is already applied, remove it
        body.classList.remove(fontClass);
        console.log('Font class removed:', fontClass);
      } else {
        // Otherwise, apply the font class
        body.classList.add(fontClass);
        console.log('Font class added:', fontClass);
      }
    });
  } else {
    console.error('Body tag not found!');
  }
}
