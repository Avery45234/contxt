import { Publisher, ContentScriptMessage, UiRequestMessage, TabContextResponse, UiUpdateMessage } from '../lib/types';

async function main() {
    const publishers: Publisher[] = await fetch(chrome.runtime.getURL('publishers.json'))
        .then((response) => response.json())
        .catch((error) => {
            console.error('[contxt] CRITICAL: Failed to load publisher data.', error);
            return [];
        });

    if (publishers.length === 0) return;
    console.log(`[contxt] Publisher data loaded successfully. Found ${publishers.length} publishers.`);

    const tabContextCache = new Map<number, TabContextResponse>();

    function getIconPaths(biasRating: string): chrome.action.TabIconDetails {
        const rating = biasRating.toLowerCase().replace(' ', '-');
        const pathPrefix = `icons/icon-`;
        const pathSuffix = `-${rating}.png`;
        const defaultPath = `${pathPrefix}128-unknown.png`;
        return { path: { '16': `${pathPrefix}16${pathSuffix}` || defaultPath, '24': `${pathPrefix}24${pathSuffix}` || defaultPath, '48': `${pathPrefix}48${pathSuffix}` || defaultPath, '128': `${pathPrefix}128${pathSuffix}` || defaultPath } };
    }

    // --- New Helper to Push Updates to UI ---
    async function sendContextUpdate(tabId: number) {
        const context = tabContextCache.get(tabId);
        const message: UiUpdateMessage = {
            type: 'CONTEXT_UPDATED',
            payload: context ?? {},
        };
        try {
            await chrome.runtime.sendMessage(message);
        } catch (e) {
            // This can happen if the side panel is not open. It's safe to ignore.
        }
    }

    // --- Event Listeners ---

    // Phase 1: Instant Publisher Analysis on URL change
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
        if (changeInfo.url) {
            try {
                const url = new URL(changeInfo.url);
                const hostname = url.hostname;
                const publisher = publishers.find((p) => hostname === p.domain || hostname.endsWith(`.${p.domain}`));

                // Store initial context (publisher only)
                tabContextCache.set(tabId, { publisher });

                console.log(`[contxt] Phase 1 (URL): Hostname=${hostname}, Found Publisher=${publisher?.displayName ?? 'None'}`);

                if (publisher) {
                    await chrome.action.setIcon({ tabId, ...getIconPaths(publisher.allsidesBias.rating) });
                } else {
                    await chrome.action.setIcon({ tabId, ...getIconPaths('unknown') });
                }
                // Proactively update the UI with publisher info
                await sendContextUpdate(tabId);

            } catch (e) {
                // Invalid URL, ignore.
            }
        }
    });

    // Phase 2: Story Analysis result from Content Script
    chrome.runtime.onMessage.addListener((message: ContentScriptMessage | UiRequestMessage, sender, sendResponse) => {
        if (message.type === 'CONTENT_ANALYSIS_RESULT' && sender.tab?.id) {
            const tabId = sender.tab.id;
            const contentInfo = message.payload;

            // Get existing context and add story info to it
            const currentContext = tabContextCache.get(tabId) ?? {};
            const newContext: TabContextResponse = { ...currentContext, content: contentInfo };
            tabContextCache.set(tabId, newContext);

            console.log(`[contxt] Phase 2 (Content): Received story analysis for Tab ${tabId}. Has Article: ${contentInfo.hasArticle}`);

            // Update badge based on story info
            const badgeText = contentInfo.hasArticle ? '1' : '';
            chrome.action.setBadgeText({ tabId, text: badgeText });
            chrome.action.setBadgeBackgroundColor({ tabId, color: '#FFFFFF' });
            chrome.action.setBadgeTextColor({ tabId, color: '#000000' });

            // Proactively update the UI with the complete context
            sendContextUpdate(tabId);
            return;
        }

        if (message.type === 'GET_CURRENT_TAB_CONTEXT') {
            (async () => {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab?.id) {
                    sendResponse(tabContextCache.get(tab.id));
                } else {
                    sendResponse(undefined);
                }
            })();
            return true;
        }
    });

    // Update UI when user switches tabs
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
        await sendContextUpdate(activeInfo.tabId);
    });

    chrome.action.onClicked.addListener(async (tab) => {
        if (tab.id) {
            await chrome.sidePanel.open({ tabId: tab.id });
        }
    });

    chrome.tabs.onRemoved.addListener((tabId) => {
        tabContextCache.delete(tabId);
    });

    console.log('[contxt] Background script initialized and listeners attached.');
}

main();