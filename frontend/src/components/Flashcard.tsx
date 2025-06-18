import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardMedia, Typography, Button, Dialog, DialogContent, IconButton, useTheme, Box, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FlipIcon from '@mui/icons-material/Flip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export interface FlashcardProps {
  id: number;
  title: string; // Frente do card
  description: string; // Verso do card
  imageUrl?: string; // Imagem da frente
  backImageUrl?: string; // Imagem do verso
  tags?: string[];
  onCorrect: (id: number) => void; // Callback para acerto
  onIncorrect: (id: number) => void; // Callback para erro
  currentCardIndex: number;
  totalCards: number;
  onPrevious: () => void;
  onNext: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
  id,
  title,
  description,
  imageUrl,
  backImageUrl,
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
    setIsFlipped(false); // Reseta o card para a próxima vez
  };

  const handleIncorrect = () => {
    onIncorrect(id);
    setIsFlipped(false); // Reseta o card para a próxima vez
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', minHeight: 250, justifyContent: 'space-between' }}>
      {/* Frente do Card */}
      <CardContent sx={{ flexGrow: 1, display: isFlipped ? 'none' : 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h5" component="div" sx={{ mb: 2 }}>
          {title}
        </Typography>
        {imageUrl && (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={title}
            sx={{
              cursor: 'pointer',
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
      </CardContent>

      {/* Verso do Card */}
      <CardContent sx={{ flexGrow: 1, display: isFlipped ? 'block' : 'none' }}>
        <Typography variant="body1" component="div" sx={{ mb: 2 }}>
          {description}
        </Typography>
        {backImageUrl && (
          <CardMedia
            component="img"
            image={backImageUrl}
            alt={description}
            sx={{
              cursor: 'pointer',
              objectFit: 'contain',
              maxWidth: '100%',
              maxHeight: 200,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
              }
            }}
            onClick={() => handleImageClick(backImageUrl)}
          />
        )}
        {tags && tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
             <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, alignSelf: 'center' }}>
                Tags:
             </Typography>
            {tags.map((tag, idx) => (
              <Chip key={idx} label={tag} size="small" color="primary" variant="outlined" />
            ))}
          </Box>
        )}
      </CardContent>

      {/* Ações */}
      <Box sx={{ 
        p: { xs: 1, sm: 2 }, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: { xs: 0.5, sm: 1 },
        borderTop: `1px solid ${theme.palette.divider}` 
      }}>
        <IconButton
          onClick={() => {
            if (currentCardIndex > 0) {
              onPrevious();
              setIsFlipped(false);
            }
          }}
          disabled={currentCardIndex === 0}
          sx={{
            width: 40,
            height: 40,
            border: `1px solid ${theme.palette.primary.main}`,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)'
            },
            '&:disabled': {
              borderColor: theme.palette.action.disabled,
              color: theme.palette.action.disabled
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 0.5, sm: 1 },
          '& .MuiButton-root': {
            minWidth: { xs: 40, sm: 'auto' },
            height: { xs: 36, sm: 'auto' },
            padding: { xs: '6px 8px', sm: '6px 16px' },
            '& .MuiButton-startIcon': {
              margin: { xs: 0, sm: '0 8px 0 -4px' },
              '& > *:nth-of-type(1)': {
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }
            },
            '& span': {
              display: { xs: 'none', sm: 'inline' }
            }
          }
        }}>
          {!isFlipped ? (
            <Button
              variant="contained"
              onClick={handleFlip}
              size="small"
              startIcon={<FlipIcon fontSize="small" />}
              sx={{
                minWidth: { xs: 40, sm: 'auto' },
                height: { xs: 36, sm: 'auto' },
                padding: { xs: '6px 8px', sm: '6px 16px' },
                '& .MuiButton-startIcon': {
                  margin: { xs: 0, sm: '0 8px 0 -4px' },
                  '& > *:nth-of-type(1)': {
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }
                },
                '& span': {
                  display: { xs: 'none', sm: 'inline' }
                }
              }}
            >
              Ver Resposta
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={handleIncorrect}
                startIcon={<HighlightOffIcon fontSize="small" />}
                sx={{
                  minWidth: { xs: 40, sm: 'auto' },
                  height: { xs: 36, sm: 'auto' },
                  padding: { xs: '6px 8px', sm: '6px 16px' },
                  '& .MuiButton-startIcon': {
                    margin: { xs: 0, sm: '0 8px 0 -4px' },
                    '& > *:nth-of-type(1)': {
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }
                  },
                  '& span': {
                    display: { xs: 'none', sm: 'inline' }
                  }
                }}
              >
                Errei
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={handleCorrect}
                startIcon={<CheckCircleOutlineIcon fontSize="small" />}
                sx={{
                  minWidth: { xs: 40, sm: 'auto' },
                  height: { xs: 36, sm: 'auto' },
                  padding: { xs: '6px 8px', sm: '6px 16px' },
                  '& .MuiButton-startIcon': {
                    margin: { xs: 0, sm: '0 8px 0 -4px' },
                    '& > *:nth-of-type(1)': {
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }
                  },
                  '& span': {
                    display: { xs: 'none', sm: 'inline' }
                  }
                }}
              >
                Acertei
              </Button>
            </>
          )}
        </Box>
        <IconButton
          onClick={() => {
            if (currentCardIndex < totalCards - 1) {
              onNext();
              setIsFlipped(false);
            }
          }}
          disabled={currentCardIndex === totalCards - 1}
          sx={{
            width: 40,
            height: 40,
            border: `1px solid ${theme.palette.primary.main}`,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)'
            },
            '&:disabled': {
              borderColor: theme.palette.action.disabled,
              color: theme.palette.action.disabled
            }
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
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
               width={0}
               height={0}
               sizes="95vw"
               style={{
                 width: '100%',
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

export default Flashcard;