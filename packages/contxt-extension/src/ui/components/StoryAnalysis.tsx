import { FC } from 'react';
import { ContentAnalysisResult } from '../../lib/types.js';

interface StoryAnalysisProps {
    content?: ContentAnalysisResult;
}

const StoryAnalysis: FC<StoryAnalysisProps> = ({ content }) => {
    if (!content) {
        return null;
    }

    return (
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <h2 className="text-lg font-bold text-slate-700 mb-2">Page Content Analysis</h2>
            <div>
                <p className="font-semibold">{content.hasArticle ? 'Found 1 Article' : 'No Article Found'}</p>
                <details className="mt-2 text-sm">
                    <summary className="cursor-pointer text-slate-600">Details</summary>
                    <div className="p-2 mt-1 bg-slate-50 rounded">
                        <p className="text-slate-800">
                            <strong>Headline:</strong> {content.headline || 'N/A'}
                        </p>
                    </div>
                </details>
            </div>
        </section>
    );
};

export default StoryAnalysis;