import React from 'react';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import Image from 'next/image';
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
          <div style={{ position: 'relative', width: '100%', height: '200px', marginTop: '10px' }}>
            <Image 
              src={flashcard.imageUrl} 
              alt={flashcard.title} 
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
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