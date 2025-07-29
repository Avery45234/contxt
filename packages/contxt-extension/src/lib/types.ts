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
}

export interface Publisher {
    domains: string[];
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

export interface SentimentResult {
    score: number;
    comparative: number;
    words: string[];
    positive: string[];
    negative: string[];
    totalWords: number;
}

export interface ReadabilityScore {
    gradeLevel: number;
    wordCount: number;
    sentenceCount: number;
    wordsPerSentence: number;
    syllablesPerWord: number;
}

export interface ContentAnalysisResult {
    hasArticle: boolean;
    headline?: string;
    readability: ReadabilityMetadata | null;
    headlineSentiment: SentimentResult | null;
    contentSentiment: SentimentResult | null;
    readabilityScore: ReadabilityScore | null;
}

export interface TabContextResponse {
    publisher?: Publisher;
    content?: ContentAnalysisResult;
}

// --- Messaging Types ---

// From Content Script to Background
export interface ContentScriptMessage {
    type: 'CONTENT_ANALYSIS_RESULT';
    payload: ContentAnalysisResult;
}

// From UI to Background
export interface UiRequestMessage {
    type: 'GET_CURRENT_TAB_CONTEXT';
}

// From Background to UI
export interface UiUpdateMessage {
    type: 'CONTEXT_UPDATED';
    payload: {
        tabId: number;
        context: TabContextResponse;
    };
}

// From Background to Content Script
export interface ReanalyzePageMessage {
    type: 'RE_ANALYZE_PAGE';
}

// Generic Log Message
export interface LogMessage {
    type: 'LOG';
    payload: string;
}

export type BackgroundMessage = ContentScriptMessage | UiRequestMessage | LogMessage | UiUpdateMessage;