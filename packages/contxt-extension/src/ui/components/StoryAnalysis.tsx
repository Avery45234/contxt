import { FC, useState } from 'react';
import { ContentAnalysisResult } from '../../lib/types.js';

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

        // Helper to sanitize strings for TSV format by removing tabs and newlines
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
            length, // length is a number, no sanitization needed
            sanitize(excerpt),
            classification,
        ];

        const tsvString = values.join('\t');

        navigator.clipboard.writeText(tsvString).then(() => {
            setCopiedState(classification);
            setTimeout(() => setCopiedState(null), 2000); // Reset after 2 seconds
        });
    };

    return (
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Page Content Analysis</h2>
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