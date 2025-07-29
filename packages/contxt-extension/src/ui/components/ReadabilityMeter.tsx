import { FC } from 'react';

interface ReadabilityMeterProps {
    gradeLevel: number;
}

const LEVELS = [
    { name: 'Elementary', range: [0, 5.9] },
    { name: 'Middle School', range: [6, 8.9] },
    { name: 'High School', range: [9, 12.9] },
    { name: 'College', range: [13, 16.9] },
    { name: 'Post-Graduate', range: [17, Infinity] },
];

const ReadabilityMeter: FC<ReadabilityMeterProps> = ({ gradeLevel }) => {
    const activeLevel = LEVELS.find((level) => gradeLevel >= level.range[0] && gradeLevel <= level.range[1]);

    return (
        <div className="space-y-1.5 text-xs">
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
            <p className="text-right text-slate-600 font-semibold pt-1">
                Grade Level: {gradeLevel.toFixed(1)}
            </p>
        </div>
    );
};

export default ReadabilityMeter;