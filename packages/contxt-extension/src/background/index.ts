import { Publisher, BackgroundMessage, TabContextResponse, ContentAnalysisResult, UiUpdateMessage } from '../lib/types.js';

async function main() {
    const publishers: Publisher[] = await fetch(chrome.runtime.getURL('publishers.json'))
        .then((response) => response.json())
        .catch((error) => {
            console.error('[contxt-bg] CRITICAL: Failed to load publisher data.', error);
            return [];
        });

    if (publishers.length === 0) return;
    console.log(`[contxt-bg] Publisher data loaded successfully. Found ${publishers.length} publishers.`);

    const tabContextCache = new Map<number, TabContextResponse>();
    const windowPanelState = new Map<number, boolean>(); // Key: windowId, Value: isOpen

    function getIconPaths(biasRating: string): chrome.action.TabIconDetails {
        const rating = biasRating.toLowerCase().replace(' ', '-');
        const pathPrefix = `icons/icon-`;
        const pathSuffix = `-${rating}.png`;
        return { path: { '16': `${pathPrefix}16${pathSuffix}`, '24': `${pathPrefix}24${pathSuffix}`, '48': `${pathPrefix}48${pathSuffix}`, '128': `${pathPrefix}128${pathSuffix}` } };
    }

    async function sendContextUpdate(tabId: number) {
        const context = tabContextCache.get(tabId);
        const message: UiUpdateMessage = {
            type: 'CONTEXT_UPDATED',
            payload: {
                tabId: tabId,
                context: context ?? {},
            },
        };
        try {
            await chrome.runtime.sendMessage(message);
        } catch (e) {
            // It's safe to ignore errors here, as they likely mean no UI is open to receive the message.
        }
    }

    async function handleStateUpdate(tabId: number, url: string, contentInfo: ContentAnalysisResult) {
        const hostname = new URL(url).hostname.replace(/^www\./, '');
        const publisher = publishers.find((p) => p.domains.some((domain) => hostname === domain));

        const currentContext = tabContextCache.get(tabId) ?? {};
        const newContext: TabContextResponse = { ...currentContext, publisher, content: contentInfo };
        tabContextCache.set(tabId, newContext);

        console.log(`[contxt-bg] State updated for Tab ${tabId}:`, newContext);

        let badgeCount = 0;
        if (publisher) {
            badgeCount += 1;
        }
        if (contentInfo.readabilityScore && contentInfo.contentSentiment) {
            badgeCount += 2;
        }

        const badgeText = badgeCount > 0 ? String(badgeCount) : '';
        await chrome.action.setBadgeText({ tabId, text: badgeText });
        await chrome.action.setBadgeBackgroundColor({ tabId, color: '#FFFFFF' });
        await chrome.action.setBadgeTextColor({ tabId, color: '#000000' });

        if (publisher) {
            await chrome.action.setIcon({ tabId, ...getIconPaths(publisher.allsidesBias.rating) });
        } else {
            await chrome.action.setIcon({ tabId, ...getIconPaths('unknown') });
        }

        await sendContextUpdate(tabId);
    }

    // --- Message Listeners ---
    chrome.runtime.onMessage.addListener((message: BackgroundMessage, sender, sendResponse) => {
        if (message.type === 'CONTENT_ANALYSIS_RESULT' && sender.tab?.id && sender.tab.url) {
            handleStateUpdate(sender.tab.id, sender.tab.url, message.payload);
            return;
        }

        if (message.type === 'GET_CURRENT_TAB_CONTEXT') {
            (async () => {
                const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
                if (tab?.id) {
                    sendResponse(tabContextCache.get(tab.id));
                } else {
                    sendResponse(undefined);
                }
            })();
            return true;
        }

        if (message.type === 'LOG') {
            console.log(message.payload);
        }
    });

    chrome.tabs.onActivated.addListener(async (activeInfo) => {
        await sendContextUpdate(activeInfo.tabId);
    });

    // --- Window-Aware Panel Management ---
    chrome.action.onClicked.addListener(async (tab) => {
        if (!tab.windowId) return;
        const windowId = tab.windowId;

        const currentState = windowPanelState.get(windowId) ?? false;
        const newState = !currentState;
        windowPanelState.set(windowId, newState);

        if (newState) {
            await chrome.sidePanel.open({ windowId });
        }

        const tabsInWindow = await chrome.tabs.query({ windowId });
        for (const t of tabsInWindow) {
            if (t.id) {
                await chrome.sidePanel.setOptions({ tabId: t.id, enabled: newState });
            }
        }
    });

    chrome.tabs.onCreated.addListener(async (tab) => {
        if (!tab.id || !tab.windowId) return;
        const panelState = windowPanelState.get(tab.windowId) ?? false;
        await chrome.sidePanel.setOptions({ tabId: tab.id, enabled: panelState });
    });

    chrome.tabs.onAttached.addListener(async (tabId, attachInfo) => {
        const panelState = windowPanelState.get(attachInfo.newWindowId) ?? false;
        await chrome.sidePanel.setOptions({ tabId, enabled: panelState });
    });

    chrome.windows.onRemoved.addListener((windowId) => {
        windowPanelState.delete(windowId);
        console.log(`[contxt-bg] Cleaned up state for closed window ${windowId}`);
    });

    chrome.tabs.onRemoved.addListener((tabId) => {
        tabContextCache.delete(tabId);
    });

    console.log('[contxt-bg] Background script initialized and listeners attached.');
}

main();