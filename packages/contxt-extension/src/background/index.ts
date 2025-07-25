import { Publisher, ContentScriptMessage, UiRequestMessage, TabContextResponse, ContentAnalysisResult, UiUpdateMessage } from '../lib/types';

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

    async function updateAction(tabId: number, contentInfo: ContentAnalysisResult) {
        const tab = await chrome.tabs.get(tabId);
        if (!tab.url) return;

        try {
            const url = new URL(tab.url);
            const hostname = url.hostname;
            const publisher = publishers.find((p) => hostname === p.domain || hostname.endsWith(`.${p.domain}`));

            console.log(`[contxt] Analyzing Tab ${tabId}: Hostname=${hostname}, Found Publisher=${publisher?.displayName ?? 'None'}`);

            tabContextCache.set(tabId, { publisher, content: contentInfo });

            if (publisher) {
                const iconDetails = getIconPaths(publisher.allsidesBias.rating);
                await chrome.action.setIcon({ tabId, ...iconDetails });
                const badgeText = contentInfo.hasArticle ? '1' : '';
                await chrome.action.setBadgeText({ tabId, text: badgeText });
                await chrome.action.setBadgeBackgroundColor({ tabId, color: '#FFFFFF' });
                await chrome.action.setBadgeTextColor({ tabId, color: '#000000' });
            } else {
                const unknownIcon = getIconPaths('unknown');
                await chrome.action.setIcon({ tabId, ...unknownIcon });
                await chrome.action.setBadgeText({ tabId, text: '' });
            }
        } catch (e) {
            console.error('[contxt] Error in updateAction:', e);
        }
    }

    // --- Event Listeners ---
    chrome.runtime.onMessage.addListener((message: ContentScriptMessage | UiRequestMessage, sender, sendResponse) => {
        if (message.type === 'CONTENT_ANALYSIS_RESULT' && sender.tab?.id) {
            updateAction(sender.tab.id, message.payload);
            return;
        }

        if (message.type === 'GET_CURRENT_TAB_CONTEXT') {
            (async () => {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab?.id) {
                    const context = tabContextCache.get(tab.id);
                    sendResponse(context);
                } else {
                    sendResponse(undefined);
                }
            })();
            return true;
        }
    });

    // --- THE KEY FIX: Proactively push updates to the UI on tab switch ---
    chrome.tabs.onActivated.addListener(async (activeInfo) => {
        const context = tabContextCache.get(activeInfo.tabId);
        const message: UiUpdateMessage = {
            type: 'CONTEXT_UPDATED',
            payload: context ?? {}, // Send empty object if no context is cached yet
        };
        await chrome.runtime.sendMessage(message);
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