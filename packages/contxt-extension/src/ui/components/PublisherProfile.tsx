import { FC } from 'react';
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { Publisher } from '../../lib/types.js';

interface PublisherProfileProps {
    publisher?: Publisher;
}

const PublisherProfile: FC<PublisherProfileProps> = ({ publisher }) => {
    if (!publisher) {
        return (
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" component="h2">
                        Publisher Analysis
                    </Typography>
                    <Typography color="text.secondary">This site is not currently in the contxt database.</Typography>
                </CardContent>
            </Card>
        );
    }

    const getBiasChipColor = (rating: string) => {
        const r = rating.toLowerCase();
        if (r.includes('left')) return 'primary';
        if (r.includes('right')) return 'error';
        return 'default';
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                    Publisher Analysis
                </Typography>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {publisher.displayName}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip
                        label={`AllSides: ${publisher.allsidesBias.rating}`}
                        color={getBiasChipColor(publisher.allsidesBias.rating)}
                        size="small"
                    />
                    <Chip
                        label={`MBFC: ${publisher.mbfc.bias}`}
                        color={getBiasChipColor(publisher.mbfc.bias)}
                        size="small"
                    />
                </Stack>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                        <strong>Factual Reporting:</strong> {publisher.mbfc.factualReporting}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Credibility:</strong> {publisher.mbfc.credibility}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PublisherProfile;