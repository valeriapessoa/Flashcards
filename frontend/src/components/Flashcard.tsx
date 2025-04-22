import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Dialog, DialogContent, IconButton, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  const [dialogImageUrl, setDialogImageUrl] = React.useState<string | null>(null);
  const theme = useTheme();

  const handleImageClick = (url: string) => {
    setDialogImageUrl(url);
    setImageDialogOpen(true);
  };
  const handleDialogClose = () => {
    setImageDialogOpen(false);
    setDialogImageUrl(null);
  };

  return (
    <Card>
      {imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={imageUrl}
          alt={title}
          style={{ cursor: 'pointer' }}
          onClick={() => handleImageClick(imageUrl)}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        {tags && tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginTop: 8 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
              🔖 Tags:
            </Typography>
            {tags.map((tag, idx) => (
              <Typography
                key={idx}
                variant="caption"
                sx={{ backgroundColor: theme.palette.primary.light, px: 1.5, py: 0.5, borderRadius: 1, color: '#fff' }}
              >
                {tag}
              </Typography>
            ))}
          </div>
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
      {/* Modal de imagem ampliada fullscreen */}
      <Dialog open={imageDialogOpen} onClose={handleDialogClose} maxWidth="md" fullScreen>
        <DialogContent sx={{ position: 'relative', p: 0, bgcolor: 'black', width: '100vw', height: '100vh', overflow: 'hidden' }}>
          <IconButton
            aria-label="Fechar"
            onClick={handleDialogClose}
            sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 1 }}
          >
            <CloseIcon />
          </IconButton>
          {dialogImageUrl && (
            <img
              src={dialogImageUrl}
              alt="Imagem ampliada"
              style={{
                width: '100vw',
                height: '100vh',
                objectFit: 'contain',
                display: 'block',
                margin: 0,
                background: 'black',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Flashcard;