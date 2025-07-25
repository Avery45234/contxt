import { FC, useEffect, useState } from 'react';
import { Publisher, TabContextResponse, UiMessage } from '../lib/types';

const App: FC = () => {
    const [publisher, setPublisher] = useState<Publisher | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContext = async () => {
            try {
                const message: UiMessage = { type: 'GET_CURRENT_TAB_CONTEXT' };
                const response: TabContextResponse | undefined = await chrome.runtime.sendMessage(message);
                setPublisher(response?.publisher);
            } catch (e) {
                console.error('Error fetching context:', e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContext();
    }, []);

    if (isLoading) {
        return <div>Loading context...</div>;
    }

    return (
        <div>
            <h1>contxt</h1>
            {publisher ? (
                <div>
                    <h2>Publisher Found:</h2>
                    <p>{publisher.displayName}</p>
                </div>
            ) : (
                <div>
                    <h2>Publisher Not Found</h2>
                    <p>This site is not currently in the contxt database.</p>
                </div>
            )}
        </div>
    );
};

export default App;