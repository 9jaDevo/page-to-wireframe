/**
 * Function to inject the content script and apply styles to the active tab.
 * @param {chrome.tabs.Tab} tab - The active tab.
 */
async function injectStylesAndScripts(tab) {
  try {
    // Get the current disabled state from storage
    chrome.storage.sync.get('disabledStyles', (data) => {
      if (data.disabledStyles) {
        console.log("Styles are disabled. Skipping injection.");
        return; // If styles are disabled, skip applying styles
      }

      console.log("Injecting styles and scripts into the current tab...");

      // Inject content script into the active tab
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-script.js']
      });
      console.log("Content script injected successfully.");

      // Inject the main CSS styles
      chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['CSS/styles.css']
      });
      console.log("CSS styles injected successfully.");

      // Apply the selected font class to the page
      chrome.storage.sync.get('selectedFont', (data) => {
        const selectedFont = data.selectedFont || 'script';
        const fontClass = selectedFont === 'standard' ? 'redacted-standard' : 'redacted-script';
        chrome.tabs.sendMessage(tab.id, { action: 'applyFont', fontClass: fontClass });
      });
    });

  } catch (error) {
    console.error('Error injecting styles and scripts:', error);
  }
}

/**
 * Event listener for when the extension icon is clicked.
 */
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    console.log("Extension icon clicked. Injecting styles to the current tab...");
    await injectStylesAndScripts(tab);
  } else {
    console.error('Tab ID is undefined.');
  }
});
