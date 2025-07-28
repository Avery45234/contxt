import { FC } from 'react';
import { Publisher } from '../../lib/types.js';
import RadialGauge from './RadialGauge';
import CredibilityMeter from './CredibilityMeter';

interface PublisherProfileProps {
    publisher?: Publisher;
}

const PublisherProfile: FC<PublisherProfileProps> = ({ publisher }) => {
    const meterFaceUrl = chrome.runtime.getURL('icons/bias-meter-face.png');

    return (
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <h2 className="text-lg font-bold text-slate-700 mb-3">Publisher Analysis</h2>
            {!publisher ? (
                <p className="text-slate-500">This site is not currently in the contxt database.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold">{publisher.displayName}</h3>

                    {/* Bias Visualization */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <RadialGauge
                                value={publisher.allsidesBias.value}
                                min={-6}
                                max={6}
                                imageUrl={meterFaceUrl}
                            />
                            <p className="text-xs text-slate-500">AllSides Bias</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <RadialGauge
                                value={publisher.mbfc.biasValue}
                                min={-8.1}
                                max={8.1}
                                imageUrl={meterFaceUrl}
                            />
                            <p className="text-xs text-slate-500">MBFC Bias</p>
                        </div>
                    </div>

                    {/* Credibility Visualization */}
                    <div className="flex flex-col items-center gap-1">
                        <CredibilityMeter value={publisher.mbfc.credibilityValue} max={8.0} />
                        <p className="text-xs text-slate-500">MBFC Factual Reporting</p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PublisherProfile;