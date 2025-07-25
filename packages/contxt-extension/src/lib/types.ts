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