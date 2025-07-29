import { Readability, ParseResult } from '@mozilla/readability';
import Sentiment from 'sentiment';
import { ContentScriptMessage, ReadabilityMetadata, SentimentResult } from '../lib/types.js';

const LOG_STYLE = 'background: #28a745; color: #ffffff; font-size: 12px; padding: 2px 5px; border-radius: 3px;';

console.log('%c[contxt-cs] Content script injected.', LOG_STYLE);

function extractMetadata(article: ParseResult | null): ReadabilityMetadata | null {
    if (!article) {
        return null;
    }
    return {
        title: article.title,
        byline: article.byline,
        length: article.length,
        excerpt: article.excerpt,
        siteName: article.siteName,
    };
}

function analyzePage() {
    try {
        const sentiment = new Sentiment();
        const parser = new DOMParser();
        const doc = parser.parseFromString(document.documentElement.outerHTML, 'text/html');
        const reader = new Readability(doc);
        const article = reader.parse();

        let headlineSentiment: SentimentResult | null = null;
        let contentSentiment: SentimentResult | null = null;

        if (article) {
            const headlineAnalysis: Sentiment.AnalysisResult = sentiment.analyze(article.title);
            headlineSentiment = {
                ...headlineAnalysis,
                totalWords: article.title.split(/\s+/).length,
            };

            const contentAnalysis: Sentiment.AnalysisResult = sentiment.analyze(article.textContent);
            contentSentiment = {
                ...contentAnalysis,
                totalWords: article.textContent.split(/\s+/).length,
            };
        }

        const message: ContentScriptMessage = {
            type: 'CONTENT_ANALYSIS_RESULT',
            payload: {
                hasArticle: article !== null,
                headline: article?.title ?? undefined,
                readability: extractMetadata(article),
                headlineSentiment,
                contentSentiment,
            },
        };

        console.log('%c[contxt-cs] Sending message to background:', LOG_STYLE, message);
        chrome.runtime.sendMessage(message);
    } catch (e) {
        console.error('[contxt-cs] Error during page analysis:', e);
    }
}

if (document.readyState !== 'loading') {
    analyzePage();
} else {
    document.addEventListener('DOMContentLoaded', analyzePage);
}