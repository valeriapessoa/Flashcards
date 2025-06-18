'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardMedia, Typography, Button, Dialog, DialogContent, IconButton, useTheme, Box, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FlipIcon from '@mui/icons-material/Flip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface IntelligentReviewCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  onCorrect: (id: number) => void;
  onIncorrect: (id: number) => void;
  currentCardIndex: number;
  totalCards: number;
  onPrevious: () => void;
  onNext: () => void;
}

const IntelligentReviewCard: React.FC<IntelligentReviewCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  tags,
  onCorrect,
  onIncorrect,
  currentCardIndex,
  totalCards,
  onPrevious,
  onNext,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [dialogImageUrl, setDialogImageUrl] = useState<string | null>(null);
  const theme = useTheme();

  const handleFlip = () => {
    setIsFlipped(true);
  };

  const handleImageClick = (url: string) => {
    setDialogImageUrl(url);
    setImageDialogOpen(true);
  };

  const handleDialogClose = () => {
    setImageDialogOpen(false);
    setDialogImageUrl(null);
  };

  const handleCorrect = () => {
    onCorrect(id);
    setIsFlipped(false);
  };

  const handleIncorrect = () => {
    onIncorrect(id);
    setIsFlipped(false);
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', minHeight: 250, justifyContent: 'space-between' }}>
      {/* Frente do Card */}
      <CardContent sx={{ flexGrow: 1, display: isFlipped ? 'none' : 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
      </CardContent>

      {/* Verso do Card */}
      <CardContent sx={{ flexGrow: 1, display: isFlipped ? 'block' : 'none' }}>
        {imageUrl && (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={title}
            sx={{
              cursor: 'pointer',
              mb: 2,
              objectFit: 'contain',
              maxWidth: '100%',
              maxHeight: 200,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }}
            onClick={() => handleImageClick(imageUrl)}
          />
        )}
        <Typography variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>
        {tags && tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, alignSelf: 'center' }}>
              🔖 Tags:
            </Typography>
            {tags.map((tag, idx) => (
              <Chip key={idx} label={tag} size="small" color="primary" variant="outlined" />
            ))}
          </Box>
        )}
      </CardContent>

      {/* Ações */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button
          variant="outlined"
          onClick={() => {
            if (currentCardIndex > 0) {
              onPrevious();
              setIsFlipped(false);
            }
          }}
          disabled={currentCardIndex === 0}
          startIcon={<ArrowBackIcon />}
        >
          Anterior
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {!isFlipped ? (
            <Button
              variant="contained"
              onClick={handleFlip}
              startIcon={<FlipIcon />}
              fullWidth
            >
              Ver Resposta
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="error"
                onClick={handleIncorrect}
                startIcon={<HighlightOffIcon />}
              >
                Errei
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleCorrect}
                startIcon={<CheckCircleOutlineIcon />}
              >
                Acertei
              </Button>
            </>
          )}
        </Box>
        <Button
          variant="outlined"
          onClick={() => {
            if (currentCardIndex < totalCards - 1) {
              onNext();
              setIsFlipped(false);
            }
          }}
          disabled={currentCardIndex === totalCards - 1}
          startIcon={<ArrowForwardIcon />}
        >
          Próximo
        </Button>
      </Box>

      {/* Modal de imagem ampliada */}
      <Dialog open={imageDialogOpen} onClose={handleDialogClose} maxWidth="md" fullScreen>
        <DialogContent sx={{ position: 'relative', p: 0, bgcolor: 'rgba(0, 0, 0, 0.85)', width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton
            aria-label="Fechar"
            onClick={handleDialogClose}
            sx={{ position: 'absolute', top: 16, right: 16, color: 'white', zIndex: 1, bgcolor: 'rgba(0, 0, 0, 0.5)', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)'} }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          {dialogImageUrl && (
            <Image
              src={dialogImageUrl}
              alt="Imagem ampliada"
              width={1200}
              height={800}
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '95vw',
                maxHeight: '95vh',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default IntelligentReviewCard;
