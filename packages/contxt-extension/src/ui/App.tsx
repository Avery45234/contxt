import { FC, useEffect } from 'react';
import { LogMessage } from '../lib/types.js';

const App: FC = () => {
    useEffect(() => {
        const log = (message: string) => {
            const logMessage: LogMessage = { type: 'LOG', payload: message };
            chrome.runtime.sendMessage(logMessage);
        };

        log('[contxt-ui] UI component mounted.');

        return () => {
            log('[contxt-ui] UI component unmounted.');
        };
    }, []);

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Hello World</h1>
            <p>The dev server is stable and the extension is loading correctly.</p>
        </div>
    );
};

export default App;