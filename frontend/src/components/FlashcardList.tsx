import React from 'react';
import { Grid } from '@mui/material';
import Flashcard from './Flashcard';

interface FlashcardData {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
}

interface FlashcardListProps {
  flashcards: FlashcardData[];
}

const FlashcardList: React.FC<FlashcardListProps> = ({ flashcards }) => {
  return (
    <Grid container spacing={2}>
      {flashcards.map((flashcard) => (
        <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
          <Flashcard
            title={flashcard.title}
            description={flashcard.description}
            imageUrl={flashcard.imageUrl}
            tags={flashcard.tags}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FlashcardList;