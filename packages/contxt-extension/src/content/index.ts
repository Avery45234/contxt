import { Readability } from '@mozilla/readability';
import { ContentScriptMessage } from '../lib/types.js';

const LOG_STYLE = 'background: #28a745; color: #ffffff; font-size: 14px; font-weight: bold; padding: 2px 5px; border-radius: 3px;';

console.log('%c[contxt-content] Script Injected.', LOG_STYLE);

function analyzePage(): void {
    try {
        console.log('%c[contxt-content] DOM content loaded. Analyzing page...', LOG_STYLE);

        const parser = new DOMParser();
        const doc = parser.parseFromString(document.body.innerHTML, 'text/html');

        const reader = new Readability(doc);
        const article = reader.parse();

        const message: ContentScriptMessage = {
            type: 'CONTENT_ANALYSIS_RESULT',
            payload: {
                hasArticle: article !== null,
                headline: article?.title ?? undefined,
            },
        };

        console.log('%c[contxt-content] Sending message to background:', LOG_STYLE, message);
        chrome.runtime.sendMessage(message);

    } catch (e) {
        console.error('[contxt-content] Error during page analysis:', e);
    }
}

if (document.readyState !== 'loading') {
    analyzePage();
} else {
    document.addEventListener('DOMContentLoaded', analyzePage);
}