export interface AllSidesBias {
    rating: string;
    value: number;
}

export interface MbfcData {
    bias: string;
    biasValue: number;
    factualReporting: string;
    credibility: string;
    credibilityValue: number;
    traffic: string;
    mediaType: string;
    country: string;
}

export interface Publisher {
    domain: string;
    displayName: string;
    allsidesBias: AllSidesBias;
    mbfc: MbfcData;
}

export interface ReadabilityMetadata {
    title: string;
    byline: string | null;
    length: number;
    excerpt: string;
    siteName: string | null;
}

export interface ContentAnalysisResult {
    hasArticle: boolean;
    headline?: string;
    readability: ReadabilityMetadata | null;
}

export interface TabContextResponse {
    publisher?: Publisher;
    content?: ContentAnalysisResult;
}

// --- Messaging Types ---

export interface ContentScriptMessage {
    type: 'CONTENT_ANALYSIS_RESULT';
    payload: ContentAnalysisResult;
}

export interface UiRequestMessage {
    type: 'GET_CURRENT_TAB_CONTEXT';
}

export interface UiUpdateMessage {
    type: 'CONTEXT_UPDATED';
    payload: {
        tabId: number;
        context: TabContextResponse;
    };
}

export interface LogMessage {
    type: 'LOG';
    payload: string;
}

export type BackgroundMessage = ContentScriptMessage | UiRequestMessage | LogMessage | UiUpdateMessage;