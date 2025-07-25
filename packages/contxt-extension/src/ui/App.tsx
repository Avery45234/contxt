import { FC, useEffect, useState } from 'react';
import { Publisher, TabContextResponse, UiRequestMessage, UiUpdateMessage } from '../lib/types';

const App: FC = () => {
    const [publisher, setPublisher] = useState<Publisher | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // This function handles updating the UI state from a context payload
        const handleContextUpdate = (context: TabContextResponse | undefined) => {
            setPublisher(context?.publisher);
        };

        // --- Set up a listener for proactive updates from the background script ---
        const messageListener = (message: UiUpdateMessage) => {
            if (message.type === 'CONTEXT_UPDATED') {
                handleContextUpdate(message.payload);
            }
        };
        chrome.runtime.onMessage.addListener(messageListener);

        // --- Request the initial context for the current tab when the panel first opens ---
        const fetchInitialContext = async () => {
            try {
                const message: UiRequestMessage = { type: 'GET_CURRENT_TAB_CONTEXT' };
                const response: TabContextResponse | undefined = await chrome.runtime.sendMessage(message);
                handleContextUpdate(response);
            } catch (e) {
                console.error('Error fetching initial context:', e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialContext();

        // --- Cleanup: Remove the listener when the component unmounts ---
        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
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