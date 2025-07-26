import { Publisher, ContentScriptMessage, UiRequestMessage, TabContextResponse, UiUpdateMessage } from '../lib/types.js';

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

    async function sendContextUpdate(tabId: number) {
        const context = tabContextCache.get(tabId);
        const message: UiUpdateMessage = {
            type: 'CONTEXT_UPDATED',
            payload: context ?? {},
        };
        try {
            await chrome.runtime.sendMessage(message);
        } catch (e) {
            // --- THE FIX: Log the error instead of ignoring it ---
            // This gives us the visibility we need.
            console.warn(`[contxt] Could not send context update to Tab ${tabId}. UI is likely closed.`, e);
        }
    }

    async function handleStateUpdate(tabId: number, url: string, contentInfo?: any) {
        const hostname = new URL(url).hostname;
        const publisher = publishers.find((p) => hostname === p.domain || hostname.endsWith(`.${p.domain}`));

        const currentContext = tabContextCache.get(tabId) ?? {};
        const newContext: TabContextResponse = {
            ...currentContext,
            publisher,
            content: contentInfo ?? currentContext.content,
        };
        tabContextCache.set(tabId, newContext);

        console.log(`[contxt] State updated for Tab ${tabId}:`, newContext);

        if (publisher) {
            await chrome.action.setIcon({ tabId, ...getIconPaths(publisher.allsidesBias.rating) });
            const badgeText = newContext.content?.hasArticle ? '1' : '';
            await chrome.action.setBadgeText({ tabId, text: badgeText });
            await chrome.action.setBadgeBackgroundColor({ tabId, color: '#FFFFFF' });
            await chrome.action.setBadgeTextColor({ tabId, color: '#000000' });
        } else {
            await chrome.action.setIcon({ tabId, ...getIconPaths('unknown') });
            await chrome.action.setBadgeText({ tabId, text: '' });
        }

        await sendContextUpdate(tabId);
    }

    chrome.runtime.onMessage.addListener((message: ContentScriptMessage | UiRequestMessage, sender, sendResponse) => {
        if (message.type === 'CONTENT_ANALYSIS_RESULT' && sender.tab?.id && sender.tab.url) {
            handleStateUpdate(sender.tab.id, sender.tab.url, message.payload);
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