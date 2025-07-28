import { FC, useEffect, useState, useCallback } from 'react';
import { TabContextResponse, UiRequestMessage, UiUpdateMessage, LogMessage } from '../lib/types.js';
import PublisherProfile from './components/PublisherProfile';
import StoryAnalysis from './components/StoryAnalysis';
import DebugFrame from './components/DebugFrame';

const App: FC = () => {
    const [context, setContext] = useState<TabContextResponse | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [myTabId, setMyTabId] = useState<number | undefined>(undefined);
    const [myWindowId, setMyWindowId] = useState<number | undefined>(undefined);
    const [activeTabId, setActiveTabId] = useState<number | undefined>(undefined);
    const [isInspectMode, setIsInspectMode] = useState(false);

    const log = useCallback((message: string) => {
        try {
            const logMessage: LogMessage = { type: 'LOG', payload: message };
            chrome.runtime.sendMessage(logMessage);
        } catch (error) {
            // Suppress "Extension context invalidated" errors when panel closes.
            // This is an expected condition, not a true error.
        }
    }, []);

    const fetchContextForTab = useCallback(
        async (tabId: number) => {
            log(`[contxt-ui] Requesting context for Tab ${tabId}`);
            setIsLoading(true);
            setContext(undefined);
            try {
                const message: UiRequestMessage = { type: 'GET_CURRENT_TAB_CONTEXT' };
                const response: TabContextResponse | undefined = await chrome.runtime.sendMessage(message);
                log(`[contxt-ui] Received initial context for Tab ${tabId}: ${JSON.stringify(response)}`);
                setContext(response);
            } catch (e) {
                console.error(`Error fetching context for Tab ${tabId}:`, e);
                setContext(undefined);
            } finally {
                setIsLoading(false);
            }
        },
        [log]
    );

    useEffect(() => {
        const initialize = async () => {
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
            if (tab?.id && tab.windowId) {
                log(`[contxt-ui] UI Initialized. MyTabId: ${tab.id}, MyWindowId: ${tab.windowId}`);
                setMyTabId(tab.id);
                setMyWindowId(tab.windowId);
                setActiveTabId(tab.id);
                fetchContextForTab(tab.id);
            } else {
                log('[contxt-ui] CRITICAL: Could not determine active tab/window on mount.');
                setIsLoading(false);
            }
        };
        initialize();
    }, [fetchContextForTab, log]);

    useEffect(() => {
        const messageListener = (message: UiUpdateMessage) => {
            if (message.type === 'CONTEXT_UPDATED' && message.payload.tabId === activeTabId) {
                log(`[contxt-ui] Accepted context update for active Tab ${activeTabId}`);
                setContext(message.payload.context);
                if (isLoading) setIsLoading(false);
            }
        };

        const tabActivationListener = (activeInfo: chrome.tabs.TabActiveInfo) => {
            if (activeInfo.windowId === myWindowId) {
                log(`[contxt-ui] Tab activated in my window: ${activeInfo.tabId}. Updating context.`);
                setActiveTabId(activeInfo.tabId);
                fetchContextForTab(activeInfo.tabId);
            }
        };

        const tabAttachListener = (tabId: number, attachInfo: chrome.tabs.TabAttachInfo) => {
            if (tabId === myTabId) {
                log(`[contxt-ui] My tab was moved to a new window: ${attachInfo.newWindowId}`);
                setMyWindowId(attachInfo.newWindowId);
            }
        };

        chrome.runtime.onMessage.addListener(messageListener);
        chrome.tabs.onActivated.addListener(tabActivationListener);
        chrome.tabs.onAttached.addListener(tabAttachListener);

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
            chrome.tabs.onActivated.removeListener(tabActivationListener);
            chrome.tabs.onAttached.removeListener(tabAttachListener);
        };
    }, [activeTabId, myTabId, myWindowId, fetchContextForTab, log, isLoading]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.shiftKey && (event.key === 'B' || event.key === 'b')) {
                event.preventDefault();
                setIsInspectMode((prev) => !prev);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const COLORS = {
        app: { border: 'border-blue-500', text: 'text-blue-800', bg: 'bg-blue-100' },
        header: { border: 'border-green-500', text: 'text-green-800', bg: 'bg-green-100' },
        main: { border: 'border-purple-500', text: 'text-purple-800', bg: 'bg-purple-100' },
        footer: { border: 'border-orange-500', text: 'text-orange-800', bg: 'bg-orange-100' },
        card: { border: 'border-red-500', text: 'text-red-800', bg: 'bg-red-100' },
    };

    return (
        <DebugFrame label="App Shell" colorClasses={COLORS.app} isActive={isInspectMode}>
            <div className="flex flex-col h-full w-[380px] bg-slate-100 text-slate-800">
                <DebugFrame label="Header" colorClasses={COLORS.header} isActive={isInspectMode}>
                    <header className="p-4 border-b border-slate-200">
                        <h1 className="text-xl font-bold">contxt</h1>
                    </header>
                </DebugFrame>

                <DebugFrame label="Main Content" colorClasses={COLORS.main} isActive={isInspectMode} className="flex-grow">
                    <main className="flex-grow overflow-y-auto p-4">
                        {isLoading ? (
                            <p>Loading context...</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <DebugFrame label="Publisher Card" colorClasses={COLORS.card} isActive={isInspectMode}>
                                    <PublisherProfile publisher={context?.publisher} />
                                </DebugFrame>
                                <DebugFrame label="Story Card" colorClasses={COLORS.card} isActive={isInspectMode}>
                                    <StoryAnalysis content={context?.content} />
                                </DebugFrame>
                            </div>
                        )}
                    </main>
                </DebugFrame>

                <DebugFrame label="Footer" colorClasses={COLORS.footer} isActive={isInspectMode}>
                    <footer className="p-2 text-center border-t border-slate-200">
                        <p className="text-xs text-slate-500">
                            Disclaimer. Ratings from{' '}
                            <a href="https://www.allsides.com/" target="_blank" rel="noopener" className="underline hover:text-blue-600">
                                AllSides
                            </a>{' '}
                            &{' '}
                            <a href="https://mediabiasfactcheck.com/" target="_blank" rel="noopener" className="underline hover:text-blue-600">
                                MBFC
                            </a>
                            .
                        </p>
                    </footer>
                </DebugFrame>
            </div>
        </DebugFrame>
    );
};

export default App;