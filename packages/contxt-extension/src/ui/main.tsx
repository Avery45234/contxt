import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './sidebar.css';

// THE DEFINITIVE FIX:
// In development mode, dynamically inject the script that connects to the
// standalone react-devtools server. This is the official, supported method.
if (import.meta.env.DEV) {
    const script = document.createElement('script');
    // The port 8097 is the default for the react-devtools package.
    script.src = 'http://localhost:8097';
    document.head.appendChild(script);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);