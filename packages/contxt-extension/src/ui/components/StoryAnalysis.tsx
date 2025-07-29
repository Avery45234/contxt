import { FC } from 'react';
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
    if (!content) {
        return null;
    }

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
            </div>
        </section>
    );
};

export default StoryAnalysis;