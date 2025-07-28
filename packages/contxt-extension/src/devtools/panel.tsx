import { FC } from 'react';
import ReactDOM from 'react-dom/client';

const Panel: FC = () => {
    return (
        <div style={{ padding: '1rem' }}>
            <h2>contxt Debug Panel</h2>
            <p>Ready to receive debug information.</p>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Panel />);