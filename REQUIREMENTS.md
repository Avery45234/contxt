# `contxt.news` - Project Requirements Document

## 1. Project Overview

*   **Project Name:** `contxt.news`
*   **Project Type:** Educational Chrome Browser Extension
*   **Mission Statement:** To promote media literacy by providing users with immediate, data-driven context about the news they read online. The tool will help users understand publisher bias, discover alternative perspectives on stories, and recognize persuasive language, empowering them to become more critical and informed news consumers.

## 2. Core Principles & Constraints

*   **Educational Focus:** The primary goal is to teach, not to tell users what to think.
*   **Free to Use:** The extension must be free for all users.
*   **No Ongoing Costs:** The architecture must not rely on paid servers or services that incur ongoing operational costs for the developer.

## 3. Minimum Viable Product (MVP) Feature Set

The MVP will focus on delivering a robust and reliable experience on pages containing a single news article from a known publisher. Features are listed in order of development priority.

### P1: Publisher Analysis

*   **Goal:** Provide users with instant information about the publisher of the content they are currently viewing.
*   **Functionality:**
    1.  When a user loads a page, the extension will identify the page's domain (e.g., `nytimes.com`).
    2.  It will look up this domain in its internal `publishers.json` database.
    3.  If a match is found, it will display the publisher's profile in the sidebar.
*   **Data to Display:**
    *   Publisher Name (e.g., "The New York Times")
    *   Bias Ratings (from both AllSides and MBFC)
    *   Factual Reporting & Credibility Ratings (from MBFC)
    *   Traffic/Popularity and Media Type (from MBFC)

### P2: Story Comparison Analysis

*   **Goal:** Show users how the same news event is being framed by different publishers across the political spectrum.
*   **Functionality:**
    1.  On a detected single-article page, extract the main headline.
    2.  Query the **NewsData.io** API to find related articles.
    3.  Display a list of headlines from different sources, each tagged with its publisher's bias rating from the internal database.

### P3: Language & Tone Analysis

*   **Goal:** Help users identify emotionally charged or persuasive language within an article.
*   **Functionality:**
    1.  On a detected single-article page, extract the core article text.
    2.  Perform a client-side sentiment analysis on the text.
    3.  Display a simple, qualitative summary of the findings (e.g., "Overall Sentiment: Negative," "The headline uses emotional language").

## 4. User Interface (UI) & User Experience (UX)

*   **Extension Icon & Badge:**
    *   The icon shall be inactive on non-publisher sites.
    *   On a recognized publisher site, the icon becomes active.
    *   A numbered badge will appear over the icon, indicating the number of available information categories (e.g., "1" for just Publisher Analysis, "3" for Publisher, Story, and Language analysis).
*   **Left-Click Action:** A left click on the extension icon will open a sidebar panel displaying all available information.
*   **Sidebar Panel:**
    *   Information will be organized into clear sections (e.g., "About the Publisher," "Other Takes on this Story," "Language Analysis").
    *   Data will be presented visually using colors, icons, and badges to make it easily scannable (e.g., color-coded bias ratings).
*   **Right-Click Action:** A right click on the icon will provide a menu with one option for the MVP: "About," which will open a page with information on the project and its data sources.
*   **Page Type Handling:**
    *   **Single Article Page:** The badge will show a count up to "3". The sidebar will show all available analysis.
    *   **Index Page (`articleCount > 1`):** The badge will only show "1". The sidebar will only display the Publisher Analysis. Story analysis for individual articles is a stretch goal.
    *   **Zero State (Non-Publisher Site):** If clicked on an unknown site, the sidebar will display a message: "This site is not currently in our database of news publishers."

## 5. Data Requirements & Management

*   **Internal Database:** A static `publishers.json` file will be bundled with the extension. It will serve as the single source of truth for all publisher data.
*   **MVP Data Scope:** The database will be populated with the ~60 mainstream publishers listed on AllSides.
*   **Data Collection:** For each publisher, the following data points will be manually collected from MBFC and stored in the JSON:
    *   `PublisherName`, `Domain`, `AllSidesBias`, `MBFCBias`, `MBFCFactualReporting`, `MBFCCredibilityRating`, `MBFCTraffic`, `MBFCMediaType`, `MBFCCountry`.
*   **External API:** The free tier of the **NewsData.io** API will be used for the Story Comparison feature. The API key will be included in the extension's client-side code for the MVP.

## 6. Technical Requirements

*   **Article Detection:** The **Mozilla Readability.js** library will be integrated to reliably identify and extract the main article content (headline and body text) from a webpage.
*   **Sentiment Analysis:** A lightweight, client-side JavaScript library (e.g., Sentiment.js) will be used for language analysis.
*   **Performance:** The extension logic will only execute on domains found in the `publishers.json` list to minimize performance impact during general browsing.

## 7. Policy & Attribution

*   **Attribution:** A footer must be persistently visible in the sidebar containing the disclaimer and links to the data sources.
    *   **Text:** "Disclaimer. Ratings from AllSides & MBFC. Story analysis powered by NewsData.io."
*   **Disclaimer:** The disclaimer will clarify the educational purpose of the tool and encourage users to think critically.

## 8. Stretch Goals (Post-MVP)

*   **Claim Analysis:** Integrate the Google Fact Check Tools API to identify and display fact-checks for specific claims within an article.
*   **On-Hover Analysis:** Implement the on-hover icon to allow users to selectively analyze individual articles on Index Pages.
*   **Expanded Database:** Increase the number of publishers covered beyond the initial MVP set.
*   **Ownership & Integrity Data:** Conduct manual research to add publisher ownership and journalistic integrity information to the database.
