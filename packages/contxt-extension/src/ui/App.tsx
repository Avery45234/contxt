import { FC, useEffect, useState } from 'react';
import { Box, CssBaseline, Link, Stack, ThemeProvider, Typography, createTheme } from '@mui/material';
import { TabContextResponse, UiRequestMessage, UiUpdateMessage } from '../lib/types.js';
import PublisherProfile from './components/PublisherProfile.jsx';
import StoryAnalysis from './components/StoryAnalysis.jsx';

const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#f4f5f7',
        },
    },
});

const App: FC = () => {
    const [context, setContext] = useState<TabContextResponse | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleContextUpdate = (newContext: TabContextResponse | undefined) => {
            setContext(newContext);
        };

        const messageListener = (message: UiUpdateMessage) => {
            if (message.type === 'CONTEXT_UPDATED') {
                handleContextUpdate(message.payload);
            }
        };
        chrome.runtime.onMessage.addListener(messageListener);

        const fetchInitialContext = async () => {
            try {
                const message: UiRequestMessage = { type: 'GET_CURRENT_TAB_CONTEXT' };
                const response: TabContextResponse | undefined = await chrome.runtime.sendMessage(message);
                handleContextUpdate(response);
            } catch (e) {
                console.error('Error fetching initial context:', e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialContext();

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        };
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '380px',
                    height: '580px',
                    overflow: 'hidden',
                }}
            >
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
                    <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                        contxt
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                    {isLoading ? (
                        <Typography>Loading context...</Typography>
                    ) : (
                        <Stack spacing={2}>
                            <PublisherProfile publisher={context?.publisher} />
                            <StoryAnalysis content={context?.content} />
                        </Stack>
                    )}
                </Box>

                <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', textAlign: 'center', flexShrink: 0 }}>
                    <Typography variant="caption" color="text.secondary">
                        Disclaimer. Ratings from{' '}
                        <Link href="https://www.allsides.com/" target="_blank" rel="noopener">AllSides</Link> &{' '}
                        <Link href="https://mediabiasfactcheck.com/" target="_blank" rel="noopener">MBFC</Link>.
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default App;