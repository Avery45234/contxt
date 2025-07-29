# `contxt` - Project Requirements Document

## 1. Project Overview

*   **Project Name:** `contxt`
*   **Project Type:** Educational Chrome Browser Extension
*   **Mission Statement:** To promote media literacy by providing users with immediate, data-driven context about the news they read online. The tool will help users understand publisher bias and recognize the sentiment and complexity of an article's language, empowering them to become more critical and informed news consumers.

## 2. Core Principles & Constraints

*   **Educational Focus:** The primary goal is to teach, not to tell users what to think.
*   **Free to Use:** The extension must be free for all users.
*   **No Ongoing Costs:** The architecture must not rely on paid servers or services that incur ongoing operational costs for the developer.

## 3. Minimum Viable Product (MVP) Feature Set

The MVP delivers a robust and reliable experience on pages containing readable content, with enhanced analysis for known publishers. Features are listed in order of development priority.

### P1: Publisher Analysis

*   **Goal:** Provide users with instant, data-driven information about the publisher of the content they are currently viewing.
*   **Functionality:**
    1.  When a user loads a page, the extension will identify the page's domain (e.g., `nytimes.com`).
    2.  It will look up this domain in its internal `publishers.json` database.
    3.  If a match is found, it will display the publisher's profile in the sidebar, including visual meters for bias and credibility.
*   **Data to Display:**
    *   Publisher Name (e.g., "The New York Times")
    *   Bias Ratings (from both AllSides and MBFC)
    *   Factual Reporting & Credibility Ratings (from MBFC)
    *   Traffic/Popularity (from MBFC)

### P2: Page Content Analysis

*   **Goal:** Provide users with linguistic context about the primary readable content on a page.
*   **Functionality:**
    1.  On any page, the extension uses Mozilla's Readability.js library to extract the main content.
    2.  If readable content is found, it performs and displays the following analyses.

*   **P2a: Sentiment Analysis**
    *   **Functionality:** Performs a client-side sentiment analysis on the extracted headline and body text separately.
    *   **UI:** Displays the results on two diverging bar charts, indicating whether the tone is positive, negative, or neutral, and showing the underlying data in a collapsible section.

*   **P2b: Readability Analysis**
    *   **Functionality:** Performs a client-side linguistic complexity analysis on the extracted body text to determine its Flesch-Kincaid grade level.
    *   **UI:** Displays the result on a vertical "Complexity Ladder" graphic, categorizing the score into educational levels (e.g., High School, College). The underlying statistics are available in a collapsible section. This analysis is disabled on homepages where the score would be invalid.

## 4. User Interface (UI) & User Experience (UX)

*   **Extension Icon & Badge:**
    *   The icon is grayscale and inactive on sites not in the publisher database.
    *   On a recognized publisher site, the icon becomes colored to match the publisher's bias rating.
    *   A numbered badge appears over the icon, indicating the number of available analysis categories:
        *   **"1"**: Publisher analysis only.
        *   **"2"**: Page Content analysis only.
        *   **"3"**: Both Publisher and Page Content analysis are available.
*   **Left-Click Action:** A left click on the extension icon will open a sidebar panel displaying all available information.
*   **Sidebar Panel:**
    *   Information is organized into two clear sections: "Publisher Analysis" and "Page Content Analysis".
    *   Data is presented visually using meters, charts, colors, and badges to make it easily scannable.
    *   The footer displays the application version number, loaded dynamically from the manifest.
*   **Zero State (Non-Publisher Site):** If the user is on a site not in the database, the "Publisher Analysis" card will display a message: "This site is not currently in our database of news publishers."

## 5. Data Requirements & Management

*   **Internal Database:** A static `publishers.json` file is bundled with the extension. It serves as the single source of truth for all publisher data.
*   **MVP Data Scope:** The database is populated with ~50 mainstream publishers.
*   **Data Collection:** For each publisher, the following data points are stored in the JSON:
    *   `displayName`, `domains` (an array to support aliases), `allsidesBias` (rating and value), `mbfc` (bias rating/value, factual reporting, credibility rating/value, traffic).

## 6. Technical Requirements

*   **Article Extraction:** The **Mozilla Readability.js** library is integrated to reliably identify and extract the main article content from a webpage.
*   **Sentiment Analysis:** The **Sentiment.js** library is used for client-side sentiment analysis.
*   **Readability Analysis:** The **text-statistics** library is used for client-side complexity analysis.
*   **Navigation Handling:** The extension uses the `chrome.webNavigation` API to reliably trigger re-analysis on both full page loads and client-side navigations within Single-Page Applications (SPAs).

## 7. Policy & Attribution

*   **Attribution:** A footer is persistently visible in the sidebar containing the disclaimer and links to the data sources.
    *   **Text:** "Disclaimer. Ratings from AllSides & MBFC."
*   **Disclaimer:** The disclaimer clarifies the educational purpose of the tool and encourages users to think critically.

## 8. Stretch Goals (Post-MVP)

*   **Robust Article Classifier:** Implement a client-side heuristic scoring system to reliably distinguish between single-article pages and index pages, showing Page Content Analysis only for the former.
*   **Related Article Search (API):** Integrate an external news API (e.g., NewsData.io) to find and display how other publishers are covering the same story.
*   **Emotional Tone Analysis:** Integrate a curated emotional lexicon (e.g., a pared-down DepecheMood) to provide a multi-dimensional analysis of the text's emotional tone.
*   **Claim Analysis (Fact-Checking):** Integrate the Google Fact Check Tools API to identify and display fact-checks for specific claims within an article.
*   **Dedicated "About" Page:** Create a full "About" page with the project's mission statement and detailed attributions, accessible via a right-click context menu on the toolbar icon.
*   **Expanded Publisher Database:** Increase the number of publishers covered beyond the initial MVP set.