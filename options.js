// options.js

document.addEventListener('DOMContentLoaded', () => {
    const fontSelection = document.getElementById('font-selection');

    // Load the saved font setting from chrome.storage
    chrome.storage.sync.get(['selectedFont'], (result) => {
        if (result.selectedFont) {
            fontSelection.value = result.selectedFont;
        } else {
            fontSelection.value = 'script'; // Default to 'script' if not set
        }
    });

    // Save the selected font setting when the user selects a new font
    fontSelection.addEventListener('change', () => {
        const selectedFont = fontSelection.value;
        chrome.storage.sync.set({ selectedFont }, () => {
            console.log('Font setting updated:', selectedFont);
        });
    });
});
