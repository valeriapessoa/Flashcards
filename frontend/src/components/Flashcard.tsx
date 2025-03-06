import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

interface FlashcardProps {
  title: string;
  description: string;
  imageUrl?: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ title, description, imageUrl }) => {
  return (
    <Card>
      {imageUrl && <CardMedia component="img" height="140" image={imageUrl} alt={title} />}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Flashcard;