import { Publisher } from '../lib/types';

// Load the publisher data from the JSON file
let publishers: Publisher[] = [];
fetch(chrome.runtime.getURL('publishers.json'))
    .then((response) => response.json())
    .then((data: Publisher[]) => {
        publishers = data;
        console.log('Publisher data loaded successfully.');
    })
    .catch((error) => console.error('Error loading publisher data:', error));

// --- Badge Color Logic ---

const COLOR_BLUE = '#007bff';   // Solid Blue for Left
const COLOR_PURPLE = '#c8a2c8'; // Light Purple for Center
const COLOR_RED = '#dc3545';    // Solid Red for Right

/**
 * Linearly interpolates between two colors.
 * @param color1 - Start color in hex.
 * @param color2 - End color in hex.
 * @param factor - A value from 0 to 1.
 * @returns A hex color string.
 */
function interpolateColor(color1: string, color2: string, factor: number): string {
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Calculates the badge color based on the AllSides bias value.
 * @param biasValue - The numerical bias rating.
 * @returns A hex color string.
 */
function getBadgeColor(biasValue: number): string {
    if (biasValue <= -3.0) return COLOR_BLUE;
    if (biasValue >= 3.0) return COLOR_RED;

    if (biasValue < 0) {
        // Interpolate from Blue (-3) to Purple (0)
        const factor = biasValue / -3.0;
        return interpolateColor(COLOR_BLUE, COLOR_PURPLE, factor);
    } else {
        // Interpolate from Purple (0) to Red (3)
        const factor = biasValue / 3.0;
        return interpolateColor(COLOR_PURPLE, COLOR_RED, factor);
    }
}

// --- Tab and Action Management ---

/**
 * Updates the extension's icon (badge) for a given tab.
 */
async function updateAction(tabId: number) {
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url) return;

    try {
        const url = new URL(tab.url);
        const domain = url.hostname.replace(/^www\./, '');
        const publisher = publishers.find((p) => p.domain === domain);

        if (publisher) {
            const biasValue = publisher.allsidesBias.value;
            const color = getBadgeColor(biasValue);

            await chrome.action.setBadgeBackgroundColor({ tabId, color });
            await chrome.action.setBadgeText({ tabId, text: '1' }); // Placeholder '1' for now
        } else {
            await chrome.action.setBadgeText({ tabId, text: '' });
        }
    } catch (e) {
        // Invalid URL, probably a chrome:// page
        await chrome.action.setBadgeText({ tabId, text: '' });
    }
}

// Update the icon when a tab is updated (e.g., new URL loaded)
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    // We only care when the URL changes.
    if (changeInfo.url) {
        updateAction(tabId);
    }
});

// Update the icon when the user switches to a different tab
chrome.tabs.onActivated.addListener((activeInfo) => {
    updateAction(activeInfo.tabId);
});

// Open the side panel when the extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
    if (tab.id) {
        await chrome.sidePanel.open({ tabId: tab.id });
    }
});

console.log('contxt background script loaded and listeners attached.');