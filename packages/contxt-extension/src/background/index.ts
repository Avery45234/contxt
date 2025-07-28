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
        const hostname = new URL(url).hostname;
        const publisher = publishers.find((p) => hostname === p.domain || hostname.endsWith(`.${p.domain}`));

        const currentContext = tabContextCache.get(tabId) ?? {};
        const newContext: TabContextResponse = { ...currentContext, publisher, content: contentInfo };
        tabContextCache.set(tabId, newContext);

        console.log(`[contxt-bg] State updated for Tab ${tabId}:`, newContext);

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

    chrome.runtime.onMessage.addListener((message: BackgroundMessage, sender, sendResponse) => {
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

        if (message.type === 'LOG') {
            console.log(message.payload);
        }
    });

    chrome.tabs.onActivated.addListener(async (activeInfo) => {
        await sendContextUpdate(activeInfo.tabId);
    });

    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

    chrome.tabs.onRemoved.addListener((tabId) => {
        tabContextCache.delete(tabId);
    });

    console.log('[contxt-bg] Background script initialized and listeners attached.');
}

main();