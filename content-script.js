// content-script.js

/**
 * @file
 * Content script that applies the selected font style to the webpage.
 */

/**
 * Apply the selected font class to the body.
 * @param {string} fontClass - The font class to apply ('redacted-script' or 'redacted-standard').
 */
function applyFont(fontClass) {
    document.body.classList.remove('redacted-script', 'redacted-standard');
    document.body.classList.add(fontClass);
}

/**
 * Remove all font styles and injected CSS from the body.
 */
function disableStyles() {
    // Remove any classes applied for the font styles
    document.body.classList.remove('redacted-script', 'redacted-standard');

    // Remove the injected CSS
    const linkElement = document.querySelector('link[href*="styles.css"]');
    if (linkElement) {
        linkElement.remove();
    }

    // Remove any other dynamically added styles (like inline styles or style elements)
    const styleElements = document.querySelectorAll('style');
    styleElements.forEach(style => style.remove());

    console.log("Styles and dynamic styles disabled successfully.");
}


/**
 * Initial font application when the content script loads.
 */
(function applyInitialFont() {
    chrome.storage.sync.get('selectedFont', (data) => {
        const selectedFont = data.selectedFont || 'script';
        const fontClass = selectedFont === 'standard' ? 'redacted-standard' : 'redacted-script';
        applyFont(fontClass);
    });

    // Inject styles.css using a link element as a fallback
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('CSS/styles.css');
    document.head.appendChild(link);
    console.log('Fallback CSS injected using <link> element.');
})();

/**
 * Listen for changes in storage and apply the new font.
 */
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.selectedFont) {
        const newFont = changes.selectedFont.newValue;
        const fontClass = newFont === 'standard' ? 'redacted-standard' : 'redacted-script';
        applyFont(fontClass);
    }
});

/**
 * Listen for messages from the background script.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'applyFont' && request.fontClass) {
        applyFont(request.fontClass);
        sendResponse({ status: 'Font applied successfully.' });
    } else if (request.action === 'disableStyles') {
        disableStyles();
        sendResponse({ status: 'Styles disabled successfully.' });
    }
});
