// This file provides a manual type declaration for the react-devtools-inline module.
// It tells TypeScript that this module exists and can be imported, resolving the TS7016 error.
declare module 'react-devtools-inline/backend';

// Provides types for readability, which is necessary as it doesn't ship its own.
declare module '@mozilla/readability' {
    export class Readability {
        constructor(doc: Document, options?: object);
        parse(): ParseResult | null;
    }

    export interface ParseResult {
        title: string;
        byline: string | null;
        content: string;
        textContent: string;
        length: number;
        excerpt: string;
        siteName: string | null;
        dir: 'ltr' | 'rtl';
    }
}

// Provides a manual type declaration for text-statistics.
declare module 'text-statistics' {
    export default function textStatistics(text: string): {
        fleschKincaidGradeLevel(): number;
        [key: string]: any;
    };
}