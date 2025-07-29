import { FC } from 'react';
import { ReadabilityScore } from '../../lib/types';

interface ReadabilityMeterProps {
    score: ReadabilityScore;
}

const LEVELS = [
    { name: 'Elementary', range: [0, 5.9] },
    { name: 'Middle School', range: [6, 8.9] },
    { name: 'High School', range: [9, 12.9] },
    { name: 'College', range: [13, Infinity] },
];

const ReadabilityMeter: FC<ReadabilityMeterProps> = ({ score }) => {
    const { gradeLevel, wordCount, sentenceCount, wordsPerSentence, syllablesPerWord } = score;
    const activeLevel = LEVELS.find((level) => gradeLevel >= level.range[0] && gradeLevel <= level.range[1]);

    return (
        <div className="text-xs">
            {/* The "Complexity Ladder" is always visible */}
            <div className="space-y-1.5">
                {LEVELS.map((level) => {
                    const isActive = level.name === activeLevel?.name;
                    return (
                        <div key={level.name} className="flex items-center gap-2">
                            <div
                                className={`w-4 h-4 rounded-sm ${isActive ? 'bg-purple-500' : 'bg-slate-200'}`}
                            ></div>
                            <span className={`font-medium ${isActive ? 'text-purple-700 font-bold' : 'text-slate-500'}`}>
                                {level.name}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* The collapsible details section for statistics */}
            <details className="mt-2">
                <summary className="flex items-center gap-1 cursor-pointer list-none text-slate-500 hover:text-slate-900 w-fit">
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
                    <span>Show Statistics</span>
                </summary>
                <div className="mt-2 ml-1 pl-3 py-1 border-l-2 border-slate-200 space-y-1 text-slate-500">
                    <p>
                        <strong>Grade Level:</strong> {gradeLevel.toFixed(1)}
                    </p>
                    <p>
                        <strong>Word Count:</strong> {wordCount}
                    </p>
                    <p>
                        <strong>Sentence Count:</strong> {sentenceCount}
                    </p>
                    <p>
                        <strong>Avg. Words/Sentence:</strong> {wordsPerSentence.toFixed(1)}
                    </p>
                    <p>
                        <strong>Avg. Syllables/Word:</strong> {syllablesPerWord.toFixed(2)}
                    </p>
                </div>
            </details>
        </div>
    );
};

export default ReadabilityMeter;