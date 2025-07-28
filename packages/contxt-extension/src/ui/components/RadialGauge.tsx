import { FC } from 'react';

interface RadialGaugeProps {
    label: string;
    value: number;
    min: number;
    max: number;
    imageUrl: string;
}

const RadialGauge: FC<RadialGaugeProps> = ({ label, value, min, max, imageUrl }) => {
    // Normalize value to a 0-1 range
    const normalized = (value - min) / (max - min);
    // Map normalized value to a -80 to +80 degree range for the needle
    const rotation = normalized * 160 - 80;

    return (
        <div>
            <p className="text-sm font-semibold text-center text-slate-600 mb-1">{label}</p>
            <div
                className="relative w-full aspect-[2/1] bg-contain bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                {/* Needle */}
                <div
                    className="absolute bottom-0 left-1/2 w-0.5 h-[90%] bg-slate-800 rounded-t-full"
                    style={{
                        transformOrigin: 'bottom center',
                        transform: `translateX(-50%) rotate(${rotation}deg)`,
                        transition: 'transform 0.5s ease-out',
                    }}
                ></div>
            </div>
        </div>
    );
};

export default RadialGauge;