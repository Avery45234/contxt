import { FC } from 'react';

interface RadialGaugeProps {
    value: number;
    min: number;
    max: number;
    imageUrl: string;
}

const RadialGauge: FC<RadialGaugeProps> = ({ value, min, max, imageUrl }) => {
    // Normalize value to a 0-1 range
    const normalized = (value - min) / (max - min);
    // Map normalized value to a -80 to +80 degree range for the needle
    const rotation = normalized * 160 - 80;

    return (
        <div
            className="relative w-full aspect-[2/1] bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
        >
            {/* CSS Triangle Needle */}
            <div
                className="absolute bottom-0 left-1/2"
                style={{
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '50px solid #1e293b', // slate-800
                    transformOrigin: 'bottom center',
                    transform: `translateX(-50%) rotate(${rotation}deg)`,
                    transition: 'transform 0.5s ease-out',
                }}
            ></div>
        </div>
    );
};

export default RadialGauge;