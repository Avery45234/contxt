import { FC, useEffect, useState } from 'react';
import { TabContextResponse, UiRequestMessage, UiUpdateMessage, LogMessage } from '../lib/types.js';
import PublisherProfile from './components/PublisherProfile.jsx';
import StoryAnalysis from './components/StoryAnalysis.jsx';

const App: FC = () => {
    const [context, setContext] = useState<TabContextResponse | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const log = (message: string) => {
        const logMessage: LogMessage = { type: 'LOG', payload: message };
        chrome.runtime.sendMessage(logMessage);
    };

    useEffect(() => {
        log('[contxt-ui] UI component mounted.');

        const handleContextUpdate = (newContext: TabContextResponse | undefined) => {
            log(`[contxt-ui] Received context update: ${JSON.stringify(newContext)}`);
            setContext(newContext);
        };

        const messageListener = (message: UiUpdateMessage) => {
            if (message.type === 'CONTEXT_UPDATED') {
                handleContextUpdate(message.payload);
            }
        };
        chrome.runtime.onMessage.addListener(messageListener);

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

        return () => {
            log('[contxt-ui] UI component unmounted.');
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);

    return (
        <div>
            <header>
                <h1>contxt</h1>
            </header>
            <main>
                {isLoading ? (
                    <p>Loading context...</p>
                ) : (
                    <>
                        <PublisherProfile publisher={context?.publisher} />
                        <StoryAnalysis content={context?.content} />
                    </>
                )}
            </main>
            <footer>
                <p>Disclaimer. Ratings from AllSides & MBFC.</p>
            </footer>
        </div>
    );
};

export default App;