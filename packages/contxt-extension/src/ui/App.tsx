import { FC, useEffect } from 'react';

const App: FC = () => {
    useEffect(() => {
        console.log('[contxt-ui] UI component mounted.');
    }, []);

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Hello World</h1>
            <p>The dev server is stable and the extension is loading correctly.</p>
        </div>
    );
};

export default App;