import { BackgroundMessage } from '../lib/types.js';

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

console.log('[contxt-bg] Background script initialized.');

chrome.runtime.onMessage.addListener((message: BackgroundMessage) => {
    if (message.type === 'LOG') {
        console.log(message.payload);
        return;
    }

    // We will re-add other handlers here in the next steps.
    console.log('[contxt-bg] Received unhandled message:', message);
});