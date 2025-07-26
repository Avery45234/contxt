import { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { TabContextResponse, UiUpdateMessage } from '../lib/types.js';

const Panel: FC = () => {
    const [context, setContext] = useState<TabContextResponse | undefined>(undefined);

    useEffect(() => {
        const messageListener = (message: UiUpdateMessage) => {
            if (message.type === 'CONTEXT_UPDATED') {
                setContext(message.payload);
            }
        };
        chrome.runtime.onMessage.addListener(messageListener);

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);

    return (
        <div style={{ fontFamily: 'sans-serif', padding: '1rem' }}>
            <h2>Live Tab Context</h2>
            <pre
                style={{
                    background: '#f0f0f0',
                    padding: '1rem',
                    borderRadius: '4px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                }}
            >
        {context ? JSON.stringify(context, null, 2) : 'No context available for this tab.'}
      </pre>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Panel />);