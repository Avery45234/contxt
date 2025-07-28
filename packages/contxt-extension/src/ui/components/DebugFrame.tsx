import { FC, ReactNode } from 'react';

interface DebugFrameProps {
    label: string;
    colorClasses: {
        border: string; // e.g., 'border-red-500'
        text: string;   // e.g., 'text-red-800'
        bg: string;     // e.g., 'bg-red-100'
    };
    isActive: boolean;
    children: ReactNode;
    className?: string;
}

const DebugFrame: FC<DebugFrameProps> = ({ label, colorClasses, isActive, children, className }) => {
    if (!isActive) {
        return <>{children}</>;
    }

    return (
        <div className={`relative border ${colorClasses.border} ${className ?? ''}`}>
            <div
                className={`absolute -top-px left-2 -translate-y-1/2 px-1 text-xs ${colorClasses.bg} ${colorClasses.text}`}
            >
                {label}
            </div>
            {children}
        </div>
    );
};

export default DebugFrame;