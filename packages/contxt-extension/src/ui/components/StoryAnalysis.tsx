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
        <section>
            <h2>Page Content Analysis</h2>
            <div>
                <p>{content.hasArticle ? 'Found 1 Article' : 'No Article Found'}</p>
                <details>
                    <summary>Details</summary>
                    <p>Headline: {content.headline || 'N/A'}</p>
                </details>
            </div>
        </section>
    );
};

export default StoryAnalysis;