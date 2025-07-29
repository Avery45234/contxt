# Privacy Policy for contxt.news

**Effective Date:** July 29, 2025

## Our Commitment to Your Privacy

The `contxt` extension was built on a simple principle: to empower your intellect without compromising your privacy.

All analysis performed by this extension happens locally, inside your browser, on your machine.

## Data Collection and Usage

The `contxt` extension **does not collect, store, transmit, or sell any of your personal information or browsing data.**

Here is how the extension handles data for its core features:

*   **Publisher Analysis:** To identify a news publisher, the extension compares the website's domain (e.g., `nytimes.com`) against a database of known publishers that is bundled with the extension. This is a local-only operation.

*   **Page Content Analysis (Sentiment & Readability):** To analyze an article's content, the extension uses the open-source `Readability.js` library to extract the text of the article. This text is then analyzed by other libraries (`sentiment`, `text-statistics`) that are also bundled with the extension. **The text of the articles you read is never sent to any external server or service.**

## Data Storage

The extension uses your browser's temporary, in-memory storage to hold analysis results for your active tabs. This data is discarded when you close the tab or your browser. It is never written to disk or transmitted anywhere.

## Third-Party Services

The current version of the `contxt` extension **does not communicate with any third-party servers or APIs.**

## Changes to This Policy

If this privacy policy changes in the future, we will update the extension with a notification and provide a clear summary of the changes.
