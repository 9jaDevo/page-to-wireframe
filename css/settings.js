document.addEventListener('DOMContentLoaded', () => {
    const fontSelection = document.getElementById('font-selection');
    const saveButton = document.getElementById('save-btn');
    const disableButton = document.getElementById('disable-btn');
    const status = document.getElementById('status');

    // Load the saved setting from chrome.storage
    chrome.storage.sync.get(['selectedFont'], (result) => {
        if (result.selectedFont) {
            fontSelection.value = result.selectedFont;
        } else {
            fontSelection.value = 'script'; // Default value
        }
    });

    // Save the selected setting to chrome.storage and notify background script
    saveButton.addEventListener('click', () => {
        const selectedFont = fontSelection.value;
        chrome.storage.sync.set({ selectedFont }, () => {
            // Provide feedback to the user
            status.textContent = 'Settings saved!';
            status.style.color = 'green';
            setTimeout(() => {
                status.textContent = '';
            }, 2000);

            // Get the current active tab
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    const currentTabId = tabs[0].id;

                    // Inject content script if not already injected
                    chrome.scripting.executeScript({
                        target: { tabId: currentTabId },
                        files: ['content-script.js']
                    })
                    .then(() => {
                        console.log("Content script injected successfully.");

                        // Send the font change message to the content script
                        chrome.tabs.sendMessage(currentTabId, {
                            action: 'applyFont',
                            fontClass: selectedFont === 'standard' ? 'redacted-standard' : 'redacted-script'
                        }, (response) => {
                            if (chrome.runtime.lastError) {
                                console.error('Error sending message to content script:', chrome.runtime.lastError.message);
                            } else {
                                console.log('Font applied:', response ? response.status : "No response received.");
                            }
                        });
                    })
                    .catch((error) => {
                        console.error('Failed to inject content script:', error);
                    });
                }
            });
        });
    });

    // Disable the styles across the pages
    disableButton.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const currentTabId = tabs[0].id;

                // Disable styles by setting the flag in storage
                chrome.storage.sync.set({ disabledStyles: true }, () => {
                    console.log("Styles disabled state saved.");
                });

                // Send message to disable styles in the active tab
                chrome.tabs.sendMessage(currentTabId, { action: 'disableStyles' }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error sending message to content script:', chrome.runtime.lastError.message);
                    } else {
                        console.log('Styles disabled:', response ? response.status : "No response received.");
                    }
                });

                // Provide feedback to the user
                status.textContent = 'Styles disabled!';
                status.style.color = 'red';
                setTimeout(() => {
                    status.textContent = '';
                }, 2000);
            }
        });
    });
});
