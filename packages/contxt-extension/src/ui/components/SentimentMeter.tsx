import { FC } from 'react';

interface SentimentMeterProps {
    label: string;
    score: number; // The comparative score, typically -1 to 1
}

const SentimentMeter: FC<SentimentMeterProps> = ({ label, score }) => {
    const isPositive = score > 0;
    const isNegative = score < 0;

    // We can cap the visualization at a certain magnitude, e.g., 0.2,
    // as comparative scores are often small. This makes the bar more visible.
    const maxMagnitude = 0.2;
    const magnitude = Math.min(Math.abs(score), maxMagnitude);
    const widthPercentage = (magnitude / maxMagnitude) * 100;

    return (
        <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-slate-600">{label}</p>
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
    );
};

export default SentimentMeter;