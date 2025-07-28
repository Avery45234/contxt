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
            {/* SVG Needle Container */}
            <div
                className="absolute bottom-0 left-1/2 w-4 h-[90%]" // Container size for the SVG
                style={{
                    transformOrigin: 'bottom center',
                    transform: `translateX(-50%) rotate(${rotation}deg)`,
                    transition: 'transform 0.5s ease-out',
                }}
            >
                <svg
                    viewBox="0 0 16 60"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'visible', // Ensure stroke is not clipped
                    }}
                >
                    <path
                        d="M 1 60 L 6 2 A 2 2 0 0 1 10 2 L 15 60 A 8 8 0 0 1 1 60 Z"
                        fill="white"
                        stroke="#1e293b"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
};

export default RadialGauge;