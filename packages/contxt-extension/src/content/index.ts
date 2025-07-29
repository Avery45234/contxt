import { Readability, ParseResult } from '@mozilla/readability';
import Sentiment from 'sentiment';
import textStatistics from 'text-statistics';
import { ContentScriptMessage, ReadabilityMetadata, ReadabilityScore, ReanalyzePageMessage, SentimentResult } from '../lib/types.js';

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
        const isBareDomain = window.location.pathname === '/' || window.location.pathname.startsWith('/index.');

        const sentiment = new Sentiment();
        const parser = new DOMParser();
        const doc = parser.parseFromString(document.documentElement.outerHTML, 'text/html');
        const reader = new Readability(doc);
        const article = reader.parse();

        let headlineSentiment: SentimentResult | null = null;
        let contentSentiment: SentimentResult | null = null;
        let readabilityScore: ReadabilityScore | null = null;

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

            // Only perform readability analysis on pages that are not bare domains.
            if (!isBareDomain) {
                const stats = textStatistics(article.textContent);
                readabilityScore = {
                    gradeLevel: stats.fleschKincaidGradeLevel(),
                    wordCount: stats.wordCount(),
                    sentenceCount: stats.sentenceCount(),
                    wordsPerSentence: stats.averageWordsPerSentence(),
                    syllablesPerWord: stats.averageSyllablesPerWord(),
                };
            }
        }

        const message: ContentScriptMessage = {
            type: 'CONTENT_ANALYSIS_RESULT',
            payload: {
                hasArticle: article !== null,
                headline: article?.title ?? undefined,
                readability: extractMetadata(article),
                headlineSentiment,
                contentSentiment,
                readabilityScore,
            },
        };

        console.log('%c[contxt-cs] Sending message to background:', LOG_STYLE, message);
        chrome.runtime.sendMessage(message);
    } catch (e) {
        console.error('[contxt-cs] Error during page analysis:', e);
    }
}

// Initial analysis on first load
if (document.readyState !== 'loading') {
    analyzePage();
} else {
    document.addEventListener('DOMContentLoaded', analyzePage);
}

// Listen for re-analysis requests from the background script for SPA navigations
chrome.runtime.onMessage.addListener((message: ReanalyzePageMessage) => {
    if (message.type === 'RE_ANALYZE_PAGE') {
        console.log('%c[contxt-cs] Re-analysis requested by background script.', LOG_STYLE);
        analyzePage();
    }
});