import { FC } from 'react';
import { Publisher } from '../../lib/types.js';
import RadialGauge from './RadialGauge';
import CredibilityMeter from './CredibilityMeter';

interface PublisherProfileProps {
    publisher?: Publisher;
}

const PublisherProfile: FC<PublisherProfileProps> = ({ publisher }) => {
    const meterFaceUrl = chrome.runtime.getURL('icons/bias-meter-face.png');

    const getBiasChipColor = (rating: string) => {
        const r = rating.toLowerCase();
        if (r.includes('left')) return 'bg-blue-100 text-blue-800';
        if (r.includes('right')) return 'bg-red-100 text-red-800';
        return 'bg-slate-200 text-slate-800';
    };

    const getFactualChipColor = (rating: string) => {
        const r = rating.toLowerCase();
        if (r.includes('very high') || r.includes('high')) return 'bg-green-100 text-green-800';
        if (r.includes('mixed')) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Publisher Analysis</h2>
            {!publisher ? (
                <p className="text-slate-500">This site is not currently in the contxt database.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold">{publisher.displayName}</h3>

                    {/* Bias Visualization */}
                    <div className="flex justify-around items-start gap-4">
                        <div className="flex flex-col items-center gap-1.5 w-32">
                            <RadialGauge
                                value={publisher.allsidesBias.value}
                                min={-6}
                                max={6}
                                imageUrl={meterFaceUrl}
                            />
                            <p className="text-xs text-slate-500 text-center leading-tight">
                                AllSides Bias:{' '}
                                <span className={`font-medium px-1.5 py-0.5 rounded-full ${getBiasChipColor(publisher.allsidesBias.rating)}`}>
                                    {publisher.allsidesBias.rating}
                                </span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 w-32">
                            <RadialGauge
                                value={publisher.mbfc.biasValue}
                                min={-8.1}
                                max={8.1}
                                imageUrl={meterFaceUrl}
                            />
                            <p className="text-xs text-slate-500 text-center leading-tight">
                                MBFC Bias:{' '}
                                <span className={`font-medium px-1.5 py-0.5 rounded-full ${getBiasChipColor(publisher.mbfc.bias)}`}>
                                    {publisher.mbfc.bias}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Credibility Visualization */}
                    <div className="flex flex-col items-center gap-1.5 w-full max-w-xs mx-auto pt-2">
                        <CredibilityMeter value={publisher.mbfc.credibilityValue} max={8.0} />
                        <p className="text-xs text-slate-500">
                            MBFC Factual Reporting:{' '}
                            <span className={`font-medium px-1.5 py-0.5 rounded-full ${getFactualChipColor(publisher.mbfc.factualReporting)}`}>
                                {publisher.mbfc.factualReporting}
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PublisherProfile;