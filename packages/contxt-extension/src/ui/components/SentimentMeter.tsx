import { FC } from 'react';
import { SentimentResult } from '../../lib/types.js';

interface SentimentMeterProps {
    label: string;
    result: SentimentResult;
}

const SentimentMeter: FC<SentimentMeterProps> = ({ result, label }) => {
    const { comparative: score, totalWords, positive, negative } = result;
    const isPositive = score > 0;
    const isNegative = score < 0;

    const maxMagnitude = 0.2;
    const magnitude = Math.min(Math.abs(score), maxMagnitude);
    const widthPercentage = (magnitude / maxMagnitude) * 100;

    return (
        <details className="text-xs">
            <summary className="flex items-center gap-2 cursor-pointer list-none">
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
                <div className="flex-grow flex flex-col gap-1">
                    <p className="font-semibold text-slate-600">{label}</p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-3 rounded-l bg-red-100 overflow-hidden" style={{ direction: 'rtl' }}>
                            {isNegative && (
                                <div
                                    className="h-full bg-red-400 rounded-l"
                                    style={{ width: `${widthPercentage}%` }}
                                ></div>
                            )}
                        </div>
                        <div className="w-px h-4 bg-slate-300"></div>
                        <div className="flex-1 h-3 rounded-r bg-green-100 overflow-hidden">
                            {isPositive && (
                                <div
                                    className="h-full bg-green-400 rounded-r"
                                    style={{ width: `${widthPercentage}%` }}
                                ></div>
                            )}
                        </div>
                    </div>
                </div>
            </summary>
            <div className="mt-2 ml-5 pl-2 py-1 border-l-2 border-slate-200 space-y-1 text-slate-500">
                <p>
                    <strong>Score:</strong> {score.toFixed(4)}
                </p>
                <p>
                    <strong>Total Words:</strong> {totalWords}
                </p>
                <p>
                    <strong>Positive Words ({positive.length}):</strong> {positive.join(', ') || 'None'}
                </p>
                <p>
                    <strong>Negative Words ({negative.length}):</strong> {negative.join(', ') || 'None'}
                </p>
            </div>
        </details>
    );
};

export default SentimentMeter;