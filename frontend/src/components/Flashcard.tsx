import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Dialog, DialogContent, IconButton, useTheme, Box, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import FlipIcon from '@mui/icons-material/Flip'; // Ícone para virar

interface FlashcardProps {
  id: number;
  title: string; // Frente do card
  description: string; // Verso do card
  imageUrl?: string; // Imagem do verso
  tags?: string[];
  onCorrect: (id: number) => void; // Callback para acerto
  onIncorrect: (id: number) => void; // Callback para erro
}

const Flashcard: React.FC<FlashcardProps> = ({
  id,
  title,
  description,
  imageUrl,
  tags,
  onCorrect,
  onIncorrect,
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
        <Typography variant="h5" component="div">
          {title}
        </Typography>
      </CardContent>

      {/* Verso do Card */}
      <CardContent sx={{ flexGrow: 1, display: isFlipped ? 'block' : 'none' }}>
        {imageUrl && (
          <CardMedia
            component="img"
            height="140"
            image={imageUrl}
            alt={title} // Usar title como alt text inicial
            sx={{ cursor: 'pointer', mb: 2, objectFit: 'contain' }} // Margin bottom e contain
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
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-around', borderTop: `1px solid ${theme.palette.divider}` }}>
        {!isFlipped ? (
          <Button
            variant="contained"
            onClick={handleFlip}
            startIcon={<FlipIcon />}
            fullWidth
          >
            Mostrar Resposta
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={handleIncorrect}
              startIcon={<HighlightOffIcon />}
              sx={{ mr: 1 }} // Margin right
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
             <img
               src={dialogImageUrl}
               alt="Imagem ampliada"
               style={{
                 maxWidth: '95vw', // Max width
                 maxHeight: '95vh', // Max height
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