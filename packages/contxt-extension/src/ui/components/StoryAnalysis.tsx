import { FC, useState } from 'react';
import { ContentAnalysisResult } from '../../lib/types.js';
import SentimentMeter from './SentimentMeter';

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
    const [copiedState, setCopiedState] = useState<'positive' | 'negative' | null>(null);

    if (!content) {
        return null;
    }

    const handleCopyToClipboard = (classification: 'positive' | 'negative') => {
        if (!content?.readability) return;

        const sanitize = (str: string | null | undefined): string => {
            if (str === null || str === undefined) {
                return '';
            }
            return str.replace(/[\t\n\r]/g, ' ');
        };

        const { title, siteName, byline, length, excerpt } = content.readability;

        const values = [
            sanitize(title),
            sanitize(siteName),
            sanitize(byline),
            length,
            sanitize(excerpt),
            classification,
        ];

        const tsvString = values.join('\t');

        navigator.clipboard.writeText(tsvString).then(() => {
            setCopiedState(classification);
            setTimeout(() => setCopiedState(null), 2000);
        });
    };

    const hasSentiment = content.headlineSentiment || content.contentSentiment;

    return (
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Page Content Analysis</h2>

            {hasSentiment && (
                <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-700 mb-2">Sentiment Analysis</h3>
                    <div className="space-y-3">
                        {content.headlineSentiment && (
                            <SentimentMeter label="Headline Sentiment" score={content.headlineSentiment.comparative} />
                        )}
                        {content.contentSentiment && (
                            <SentimentMeter label="Content Sentiment" score={content.contentSentiment.comparative} />
                        )}
                    </div>
                </div>
            )}

            <div>
                <p className="font-semibold text-slate-700">
                    {content.hasArticle ? 'Found Readable Content' : 'No Readable Content Found'}
                </p>
                <details open className="mt-2 text-sm">
                    <summary className="cursor-pointer text-slate-600 hover:text-slate-900">
                        Show Readability.js Metadata
                    </summary>
                    <div className="p-2 mt-2 bg-slate-50 rounded space-y-1">
                        {content.readability ? (
                            <>
                                <ReadabilityDetail label="Title" value={content.readability.title} />
                                <ReadabilityDetail label="Site Name" value={content.readability.siteName} />
                                <ReadabilityDetail label="Byline" value={content.readability.byline} />
                                <ReadabilityDetail label="Length" value={content.readability.length} />
                                <ReadabilityDetail label="Excerpt" value={content.readability.excerpt} />
                            </>
                        ) : (
                            <p className="text-slate-500 italic">No metadata available.</p>
                        )}
                    </div>
                </details>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                        onClick={() => handleCopyToClipboard('positive')}
                        className="text-xs font-semibold py-1 px-2 rounded bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50"
                        disabled={!content.readability}
                    >
                        {copiedState === 'positive' ? 'Copied!' : 'Log as Article'}
                    </button>
                    <button
                        onClick={() => handleCopyToClipboard('negative')}
                        className="text-xs font-semibold py-1 px-2 rounded bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
                        disabled={!content.readability}
                    >
                        {copiedState === 'negative' ? 'Copied!' : 'Log as Not Article'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default StoryAnalysis;