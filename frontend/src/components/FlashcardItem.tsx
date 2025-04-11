import React from 'react';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { Flashcard } from '../types';

interface FlashcardItemProps {
  flashcard: Flashcard;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({ flashcard, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {flashcard.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {flashcard.description}
        </Typography>
        {flashcard.imageUrl && (
          <img src={flashcard.imageUrl} alt={flashcard.title} style={{ width: '100%', marginTop: '10px' }} />
        )}
        <Typography variant="body2" color="text.secondary">
          Tags: {flashcard.tags.join(', ')}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onEdit(flashcard.id)}>
          Edit
        </Button>
        <Button size="small" color="error" onClick={() => onDelete(flashcard.id)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default FlashcardItem;