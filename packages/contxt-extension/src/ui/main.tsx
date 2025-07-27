import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './sidebar.css';

// THE DEFINITIVE FIX:
// In development mode, import the inline devtools connector.
// This is safe, targeted, and will not affect other tabs.
if (import.meta.env.DEV) {
    import('react-devtools-inline/backend');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);