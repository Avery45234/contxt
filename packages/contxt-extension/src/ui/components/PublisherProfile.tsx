import { FC } from 'react';
import { Publisher } from '../../lib/types.js';

interface PublisherProfileProps {
    publisher?: Publisher;
}

const PublisherProfile: FC<PublisherProfileProps> = ({ publisher }) => {
    if (!publisher) {
        return (
            <section>
                <h2>Publisher Analysis</h2>
                <p>This site is not currently in the contxt database.</p>
            </section>
        );
    }

    return (
        <section>
            <h2>Publisher Analysis</h2>
            <h3>{publisher.displayName}</h3>
            <div>
                <span>AllSides: {publisher.allsidesBias.rating}</span>
                <span>MBFC: {publisher.mbfc.bias}</span>
            </div>
            <div>
                <p>Factual Reporting: {publisher.mbfc.factualReporting}</p>
                <p>Credibility: {publisher.mbfc.credibility}</p>
            </div>
        </section>
    );
};

export default PublisherProfile;