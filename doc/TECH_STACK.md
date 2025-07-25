# `contxt.news` - Technical Stack Specification

## 1. Document Purpose

This document specifies the official technology stack for the `contxt.news` Chrome extension project. The selected tools are chosen to promote rapid development, code quality, maintainability, and a professional user experience, while providing an excellent learning environment for modern web development practices.

## 2. Core Development Environment

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Language** | **TypeScript** | Provides static typing to catch errors during development, improve code readability, and enable superior autocompletion and refactoring in the IDE. Essential for managing the structured data model of the application (e.g., `publishers.json`). |
| **IDE** | **WebStorm** | A professional Integrated Development Environment with top-tier, out-of-the-box support for TypeScript, React, and the entire web ecosystem. Its powerful debugging and code insight tools will accelerate development and learning. |
| **Version Control** | **GitHub** | The industry standard for source code management and collaboration. It provides a robust platform for versioning, issue tracking, and showcasing the final project. |

## 3. Frontend Framework & Build Tools

This stack is responsible for compiling the source code and rendering the user interface of the extension's sidebar.

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Build Tool / Bundler** | **Vite** | A next-generation frontend tooling system that provides an extremely fast development server and optimized build process. We will use a Vite starter template specifically configured for building a React+TypeScript Chrome extension to eliminate complex setup. |
| **UI Framework** | **React** | The leading UI library for building component-based user interfaces. It will allow us to structure the extension's sidebar into clean, reusable components (e.g., `<PublisherProfile />`, `<StoryComparison />`), making the application modular and easy to maintain. |
| **Styling & UI Kit** | **Material-UI (MUI)** | A comprehensive library of pre-built React components that implement Google's Material Design. By using MUI, we gain access to a wide array of high-quality, accessible UI elements (Buttons, Badges, Cards, Icons, etc.), enabling us to build a polished, professional, and visually consistent user interface with minimal effort. |

## 4. Key Libraries & APIs

These third-party libraries and services provide the core functionality for the extension's analysis features.

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Article Extraction** | **Mozilla Readability.js** | A robust, battle-tested library designed to extract the primary, readable content from any webpage. This is critical for reliably isolating article text for the Language & Tone Analysis feature. |
| **Language Analysis** | **Sentiment.js** (or similar) | A lightweight, dependency-free JavaScript library for client-side sentiment analysis. Its small footprint and simplicity make it ideal for integration into a browser extension without impacting performance. |
| **News Aggregation API** | **NewsData.io (Free Tier)** | Provides the backend for the Story Comparison feature. Chosen for its generous free tier (200 requests/day), which offers the most robust service within the project's "no ongoing costs" constraint. |

---
This technical stack represents a modern, powerful, and cohesive set of tools perfectly suited to building the `contxt.news` application efficiently and to a high standard of quality.
