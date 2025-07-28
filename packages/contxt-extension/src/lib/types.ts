export interface AllSidesBias {
    rating: string;
    value: number;
}

export interface MbfcData {
    bias: string;
    factualReporting: string;
    credibility: string;
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

export interface ContentAnalysisResult {
    hasArticle: boolean;
    headline?: string;
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
    payload: TabContextResponse;
}

export interface LogMessage {
    type: 'LOG';
    payload: string;
}

export type BackgroundMessage = ContentScriptMessage | UiRequestMessage | LogMessage | UiUpdateMessage;