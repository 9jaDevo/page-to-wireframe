// Apply or remove the font class on the body tag.
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

// Inject font-related styles on page load.
const head = document.head || document.getElementsByTagName('head')[0];
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = chrome.runtime.getURL('CSS/font.css'); // Ensure path is correct for the font styles
head.appendChild(fontLink);