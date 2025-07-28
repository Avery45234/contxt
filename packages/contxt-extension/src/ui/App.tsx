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
        <div className="flex flex-col h-screen w-[380px] bg-slate-100 text-slate-800">
            {/* Header */}
            <header className="p-4 border-b border-slate-200">
                <h1 className="text-xl font-bold">contxt</h1>
            </header>

            {/* Main Content (Scrollable) */}
            <main className="flex-grow overflow-y-auto p-4">
                {isLoading ? (
                    <p>Loading context...</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <PublisherProfile publisher={context?.publisher} />
                        <StoryAnalysis content={context?.content} />
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="p-2 text-center border-t border-slate-200">
                <p className="text-xs text-slate-500">
                    Disclaimer. Ratings from{' '}
                    <a href="https://www.allsides.com/" target="_blank" rel="noopener" className="underline hover:text-blue-600">
                        AllSides
                    </a> &{' '}
                    <a href="https://mediabiasfactcheck.com/" target="_blank" rel="noopener" className="underline hover:text-blue-600">
                        MBFC
                    </a>.
                </p>
            </footer>
        </div>
    );
};

export default App;