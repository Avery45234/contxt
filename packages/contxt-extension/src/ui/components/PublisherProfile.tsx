import { FC } from 'react';
import { Publisher } from '../../lib/types.js';

interface PublisherProfileProps {
    publisher?: Publisher;
}

const PublisherProfile: FC<PublisherProfileProps> = ({ publisher }) => {
    const getBiasChipColor = (rating: string) => {
        const r = rating.toLowerCase();
        if (r.includes('left')) return 'bg-blue-100 text-blue-800';
        if (r.includes('right')) return 'bg-red-100 text-red-800';
        return 'bg-slate-200 text-slate-800';
    };

    return (
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <h2 className="text-lg font-bold text-slate-700 mb-2">Publisher Analysis</h2>
            {!publisher ? (
                <p className="text-slate-500">This site is not currently in the contxt database.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold">{publisher.displayName}</h3>
                    <div className="flex flex-row gap-2 items-center">
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getBiasChipColor(publisher.allsidesBias.rating)}`}>
              AllSides: {publisher.allsidesBias.rating}
            </span>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getBiasChipColor(publisher.mbfc.bias)}`}>
              MBFC: {publisher.mbfc.bias}
            </span>
                    </div>
                    <div className="text-sm text-slate-600 mt-2">
                        <p>
                            <strong>Factual Reporting:</strong> {publisher.mbfc.factualReporting}
                        </p>
                        <p>
                            <strong>Credibility:</strong> {publisher.mbfc.credibility}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PublisherProfile;