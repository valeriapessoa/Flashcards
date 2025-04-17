import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

interface FlashcardProps {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  onMarkAsReviewed: () => void;
  showReviewButton: boolean;
}

const Flashcard: React.FC<FlashcardProps> = ({
  id,
  title,
  description,
  imageUrl,
  tags,
  onMarkAsReviewed,
  showReviewButton,
}) => {
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
        {tags && tags.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Tags: {Array.isArray(tags)
              ? tags.map((tag, idx) => (
                  <span key={idx} style={{ marginRight: 4 }}>
                    {tag}
                  </span>
                ))
              : tags}
          </Typography>
        )}
        {showReviewButton && (
          <Button
            variant="contained"
            color="primary"
            onClick={onMarkAsReviewed}
            style={{ marginTop: '1rem' }}
          >
            Marcar como Revisado
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Flashcard;