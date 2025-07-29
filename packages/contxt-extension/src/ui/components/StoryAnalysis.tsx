import { FC } from 'react';
import { ContentAnalysisResult } from '../../lib/types.js';
import SentimentMeter from './SentimentMeter';
import ReadabilityMeter from './ReadabilityMeter';

interface StoryAnalysisProps {
    content?: ContentAnalysisResult;
}

const ReadabilityDetail: FC<{ label: string; value: string | number | null }> = ({ label, value }) => {
    if (value === null || value === undefined) return null;
    return (
        <p className="text-slate-800 break-words">
            <strong className="font-semibold">{label}:</strong> {String(value)}
        </p>
    );
};

const StoryAnalysis: FC<StoryAnalysisProps> = ({ content }) => {
    if (!content) {
        return null;
    }

    const hasSentiment = content.headlineSentiment || content.contentSentiment;
    const hasReadabilityData = content.readabilityScore !== undefined; // Check for presence, even if null

    return (
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Page Content Analysis</h2>

            {hasSentiment && (
                <div className="mb-4 pb-4 border-b border-slate-200">
                    <h3 className="text-base font-bold text-slate-700 mb-2">Sentiment Analysis</h3>
                    <div className="space-y-3">
                        {content.headlineSentiment && (
                            <SentimentMeter label="Headline Sentiment" result={content.headlineSentiment} />
                        )}
                        {content.contentSentiment && (
                            <SentimentMeter label="Content Sentiment" result={content.contentSentiment} />
                        )}
                    </div>
                </div>
            )}

            {hasReadabilityData && (
                <div className="mb-4 pb-4 border-b border-slate-200">
                    <h3 className="text-base font-bold text-slate-700 mb-2">Readability Analysis</h3>
                    <ReadabilityMeter score={content.readabilityScore} />
                </div>
            )}

            <div>
                <h3 className="text-base font-bold text-slate-700 mb-2">Readable Content</h3>
                {content.readability ? (
                    <div className="text-sm">
                        <div className="space-y-1">
                            <ReadabilityDetail label="Title" value={content.readability.title} />
                            <ReadabilityDetail label="Site Name" value={content.readability.siteName} />
                        </div>
                        <details className="mt-2">
                            <summary className="flex items-center gap-1 cursor-pointer list-none text-xs text-slate-500 hover:text-slate-900 w-fit">
                                <svg
                                    className="w-3 h-3 text-slate-500 transition-transform details-arrow"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>Show Details</span>
                            </summary>
                            <div className="mt-2 ml-1 pl-3 py-1 border-l-2 border-slate-200 space-y-1">
                                <ReadabilityDetail label="Byline" value={content.readability.byline} />
                                <ReadabilityDetail label="Length (chars)" value={content.readability.length} />
                                <ReadabilityDetail label="Excerpt" value={content.readability.excerpt} />
                            </div>
                        </details>
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 italic">No primary article content was found on this page.</p>
                )}
            </div>
        </section>
    );
};

export default StoryAnalysis;