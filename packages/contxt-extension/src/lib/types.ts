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

// --- Messaging Types ---

export interface ContentAnalysisResult {
    hasArticle: boolean;
    headline?: string;
}

// Message from Content Script to Background
export interface ContentScriptMessage {
    type: 'CONTENT_ANALYSIS_RESULT';
    payload: ContentAnalysisResult;
}

// Message from UI to Background
export interface UiMessage {
    type: 'GET_CURRENT_TAB_CONTEXT';
}

// Response from Background to UI
export interface TabContextResponse {
    publisher?: Publisher;
    content?: ContentAnalysisResult;
}