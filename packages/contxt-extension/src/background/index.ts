console.log('contxt background script loaded.');

chrome.runtime.onInstalled.addListener(() => {
    console.log('contxt extension installed.');
});