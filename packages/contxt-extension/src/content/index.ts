import { Readability } from '@mozilla/readability';
import { ContentScriptMessage } from '../lib/types';

const LOG_STYLE = 'background: #28a745; color: #ffffff; font-size: 14px; font-weight: bold; padding: 2px 5px; border-radius: 3px;';

console.log('%c[contxt-content] Script Injected.', LOG_STYLE);

function analyzePage(): void {
    try {
        console.log('%c[contxt-content] Analyzing page content...', LOG_STYLE);

        // --- THE FIX ---
        // Instead of cloning the live document, parse its body's HTML into a new, clean document.
        const parser = new DOMParser();
        const doc = parser.parseFromString(document.body.innerHTML, 'text/html');
        // --- END FIX ---

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

// Run the analysis once the page is fully loaded
if (document.readyState === 'complete') {
    analyzePage();
} else {
    window.addEventListener('load', analyzePage);
}