# contxt

> Clarity through context.

`contxt` is a lightweight, educational Chrome browser extension designed to promote media literacy. It acts as a precision instrument that reveals the full spectrum of context behind news articles, empowering users to see beyond the headline.

The core mission is to serve the user's intellect by presenting data neutrally, allowing them to draw their own conclusions.

## Core Features (MVP)

*   **Publisher Analysis:** For any website in its database of known news publishers, `contxt` displays key metrics including political bias ratings from AllSides and Media Bias/Fact Check (MBFC), as well as MBFC's factual reporting and credibility scores.
*   **Sentiment Analysis:** The extension analyzes the extracted headline and body text of an article, providing a visual breakdown of its positive, negative, or neutral tone.
*   **Readability Analysis:** The complexity of an article's text is measured and displayed as a Flesch-Kincaid grade level, helping the user understand the intended audience and linguistic style.

## Tech Stack

*   **Environment:** Monorepo managed with NPM Workspaces
*   **Language:** TypeScript
*   **Build Tool:** Vite with the `@crxjs/vite-plugin`
*   **UI Framework:** React
*   **Styling:** Tailwind CSS
*   **Core Libraries:**
    *   `@mozilla/readability`: For article content extraction.
    *   `sentiment`: For sentiment analysis.
    *   `text-statistics`: For readability analysis.

## Getting Started

To set up the development environment, follow these steps.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/contxt.git
    cd contxt
    ```

2.  **Install dependencies:**
    This is a monorepo, so dependencies must be installed from the root directory.
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Vite development server and generate an unpacked `dist` directory inside `packages/contxt-extension`.

4.  **Load the extension in Chrome:**
    *   Navigate to `chrome://extensions`.
    *   Enable "Developer mode" in the top right corner.
    *   Click "Load unpacked".
    *   Select the `packages/contxt-extension/dist` directory.

The extension will now be installed and will automatically update as you make changes to the source code.

## Available Scripts

The following scripts are available to be run from the root of the repository:

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server for the extension. |
| `npm run build` | Creates an optimized, production-ready build in the `dist` directory. |
| `npm run validate` | Runs the TypeScript compiler to check for type errors. |
| `npm run lint` | Lints the codebase for style and quality issues using ESLint. |
| `npm run format` | Formats the entire codebase using Prettier. |
| `npm run purge` | Deletes all `node_modules`, `dist`, and `package-lock.json` files for a clean reinstall. |

## Architectural Principles

This project is built with a strong adherence to a few core principles:

*   **Serve the User's Intellect:** The application must present data neutrally and empower the user to draw their own conclusions.
*   **Uphold Data Integrity:** All data must be represented faithfully and attributed clearly.
*   **Build with Architectural Discipline:** Code must be clean, component-based, and maintainable, adhering strictly to the defined tech stack.

## License

Licensed under the [MIT License](LICENSE).