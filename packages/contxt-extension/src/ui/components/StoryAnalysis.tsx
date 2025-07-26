import { FC } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
// THE DEFINITIVE FIX: Revert to the standard, top-level, destructured import.
// Our now-correct tsconfig and vite.config will handle this correctly.
import { ExpandMore } from '@mui/icons-material';
import { ContentAnalysisResult } from '../../lib/types.js';

interface StoryAnalysisProps {
    content?: ContentAnalysisResult;
}

const StoryAnalysis: FC<StoryAnalysisProps> = ({ content }) => {
    if (!content) {
        return null;
    }

    return (
        <Box>
            <Typography variant="h6" component="h2" gutterBottom>
                Page Content Analysis
            </Typography>
            <Accordion variant="outlined">
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography>
                        {content.hasArticle ? 'Found 1 Article' : 'No Article Found'}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ wordBreak: 'break-word' }}>
                        <Typography variant="body2">
                            <strong>Headline:</strong> {content.headline || 'N/A'}
                        </Typography>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

export default StoryAnalysis;