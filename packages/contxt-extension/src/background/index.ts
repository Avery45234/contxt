chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

console.log('[contxt-bg] Background script initialized.');

chrome.runtime.onMessage.addListener((message) => {
    console.log('[contxt-bg] Received message:', message);
});