const LOG_STYLE = 'background: #28a745; color: #ffffff; font-size: 12px; padding: 2px 5px; border-radius: 3px;';

console.log('%c[contxt-cs] Content script injected.', LOG_STYLE);

function analyzePage() {
    const message = { type: 'PAGE_ANALYSIS', payload: { url: window.location.href } };
    console.log('%c[contxt-cs] Sending message to background:', LOG_STYLE, message);
    chrome.runtime.sendMessage(message);
}

if (document.readyState !== 'loading') {
    analyzePage();
} else {
    document.addEventListener('DOMContentLoaded', analyzePage);
}