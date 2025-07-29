# `contxt` - Technical Stack Specification

## 1. Document Purpose

This document specifies the official technology stack for the `contxt` Chrome extension project. The selected tools are chosen to promote a lean and performant final product, code quality, maintainability, and a professional user experience.

## 2. Core Development Environment

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Language** | **TypeScript** | Provides static typing to catch errors during development, improve code readability, and enable superior autocompletion. Essential for managing the structured data model of the application. |
| **IDE** | **WebStorm** | A professional Integrated Development Environment with top-tier support for the entire modern web ecosystem. |
| **Version Control** | **GitHub** | The industry standard for source code management and collaboration. |
| **Project Structure** | **NPM Workspaces** | Managed as a monorepo. This centralizes tooling (`ESLint`, `Prettier`, `TypeScript`), ensures dependency consistency, and provides a scalable structure for future packages. |

## 3. Frontend Framework & Build Tools

This stack is responsible for compiling the source code and rendering the user interface of the extension's sidebar.

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Build Tool / Bundler** | **Vite** | A next-generation frontend tooling system that provides an extremely fast and stable development server and an optimized production build process. |
| **Extension Framework** | **@crxjs/vite-plugin** | The official Vite plugin for building Chrome extensions. It automates the creation of the manifest and manages the complexities of Hot Module Replacement (HMR) for the extension's sandboxed environments. |
| **UI Framework** | **React** | The leading library for building component-based user interfaces. It allows us to structure the extension's UI into clean, reusable, and maintainable components. |
| **Styling Framework** | **Tailwind CSS** | A utility-first CSS framework. Tailwind's Just-In-Time (JIT) compiler ensures that only the CSS that is actually used is included in the final build, resulting in a lean, performant, and highly maintainable stylesheet. This choice was made after rejecting MUI, which proved architecturally unsuitable due to unacceptable build complexity and bundle bloat for a lightweight extension. |

## 4. Key Analysis Libraries

These third-party libraries are integrated to provide the core analysis features of the MVP. All analysis is performed locally on the client-side.

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Article Extraction** | **Mozilla Readability.js** | A robust, battle-tested library designed to extract the primary, readable content from any webpage. This is critical for reliably isolating article text. |
| **Sentiment Analysis** | **Sentiment.js** | A lightweight, dependency-free JavaScript library for client-side sentiment analysis. Its small footprint is ideal for integration into a browser extension. |
| **Readability Analysis** | **text-statistics** | A compact, dependency-free library for calculating linguistic complexity metrics, such as the Flesch-Kincaid grade level. |
