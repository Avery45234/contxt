import { FC } from 'react';

interface CredibilityMeterProps {
    value: number; // Range 0 (High) to 7.6 (Low)
    max: number; // The max value for the scale, e.g., 8
}

const CredibilityMeter: FC<CredibilityMeterProps> = ({ value, max }) => {
    // Invert and normalize the value
    const fillPercentage = ((max - value) / max) * 100;

    const getFillColor = () => {
        if (fillPercentage > 75) return 'bg-green-500'; // High
        if (fillPercentage > 40) return 'bg-yellow-500'; // Medium
        return 'bg-red-500'; // Low
    };

    return (
        <div className="relative w-full h-4 bg-slate-200 rounded-sm overflow-hidden">
            {/* Proportional Fill Bar */}
            <div
                className={`absolute top-0 left-0 h-full ${getFillColor()}`}
                style={{ width: `${fillPercentage}%`, transition: 'width 0.5s ease-out' }}
            ></div>
            {/* Segment Dividers */}
            <div className="absolute top-0 left-0 w-full h-full flex">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex-1 border-r border-white/50"></div>
                ))}
                <div className="flex-1"></div>
            </div>
        </div>
    );
};

export default CredibilityMeter;