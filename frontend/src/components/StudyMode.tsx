"use client";

import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Dialog, DialogContent, IconButton, Box } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query'; 
import { incrementErrorCount } from '../lib/api'; 
import { Flashcard } from '../types';
import CloseIcon from '@mui/icons-material/Close';

interface StudyModeProps {
  flashcards: Flashcard[];
}

const StudyMode: React.FC<StudyModeProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFront, setIsFront] = useState(true);
  const queryClient = useQueryClient(); 

  const mutation = useMutation({
    mutationFn: incrementErrorCount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
      console.log('Contador de erro incrementado e query invalidada.');
    },
    onError: (error) => {
      console.error("Erro ao incrementar contador de erro:", error);
    },
  });

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setIsFront(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setIsFront(true);
    }
  };

  const handleFlip = () => {
    setIsFront((prevIsFront) => !prevIsFront);
  };

  const handleMarkCorrect = () => {
    handleNext();
  };

  const handleMarkIncorrect = () => {
    if (flashcards[currentIndex]) {
      mutation.mutate(flashcards[currentIndex].id);
    }
    handleNext();
  };

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [dialogImageUrl, setDialogImageUrl] = useState<string | null>(null);

  const handleImageClick = (url: string) => {
    setDialogImageUrl(url);
    setImageDialogOpen(true);
  }

  const handleDialogClose = () => {
    setImageDialogOpen(false);
    setDialogImageUrl(null);
  }

  const currentFlashcard = flashcards[currentIndex];

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {isFront ? currentFlashcard.title : currentFlashcard.description}
        </Typography>
        {/* Exibe a imagem apenas no verso (resposta) */}
        {!isFront && currentFlashcard.imageUrl && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 2,
              mb: 2,
            }}
          >
            <img
              src={currentFlashcard.imageUrl}
              alt="Imagem da resposta"
              style={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'contain',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                background: '#f5f5f5',
                display: 'block',
              }}
              onClick={() => handleImageClick(currentFlashcard.imageUrl!)}
            />
          </Box>
        )}
        {/* Exibe as tags do flashcard DEPOIS da imagem */}
        {currentFlashcard.tags && currentFlashcard.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2, mb: 2 }}>
            {(currentFlashcard.tags as (string | { id: string | number; text: string })[]).map((tagObjOrStr, idx) => {
              if (typeof tagObjOrStr === 'string') {
                return (
                  <Box
                    key={tagObjOrStr}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      borderRadius: 2,
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      letterSpacing: 0.5,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      display: 'inline-block',
                    }}
                  >
                    #{tagObjOrStr}
                  </Box>
                );
              } else if (tagObjOrStr && typeof tagObjOrStr === 'object' && 'text' in tagObjOrStr) {
                return (
                  <Box
                    key={tagObjOrStr.id ?? idx}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                      borderRadius: 2,
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      letterSpacing: 0.5,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      display: 'inline-block',
                    }}
                  >
                    #{tagObjOrStr.text}
                  </Box>
                );
              }
              return null;
            })}
          </Box>
        )}
        {/* Modal para imagem ampliada */}
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
        {/* Botões de navegação só aparecem na frente do card */}
        {isFront && (
          <div className="mt-4 flex justify-center gap-4">
            <Button variant="outlined" onClick={handlePrev} disabled={currentIndex === 0}>
              Anterior
            </Button>
            <Button variant="outlined" onClick={handleFlip}>
              Ver Resposta
            </Button>
            <Button variant="outlined" onClick={handleNext} disabled={currentIndex === flashcards.length - 1}>
              Próximo
            </Button>
          </div>
        )}
        {/* Botões de correto/incorreto só aparecem no verso */}
        {!isFront && (
          <div className="mt-4 flex justify-center gap-4">
            <Button variant="outlined" onClick={handleFlip}>
              Ver Pergunta
            </Button>
            <Button variant="contained" color="success" onClick={handleMarkCorrect}>Correto</Button>
            <Button variant="contained" color="error" onClick={handleMarkIncorrect}>Incorreto</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudyMode;