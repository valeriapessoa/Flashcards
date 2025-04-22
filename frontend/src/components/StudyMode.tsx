"use client";

import React, { useState } from 'react';
import { Button, Card, CardContent, Typography, Dialog, DialogContent, IconButton } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Importar useMutation e useQueryClient
import { incrementErrorCount } from '../lib/api'; // Importar a função da API
import { Flashcard } from '../types';
import CloseIcon from '@mui/icons-material/Close';
interface StudyModeProps {
  flashcards: Flashcard[];
}

const StudyMode: React.FC<StudyModeProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFront, setIsFront] = useState(true);
  const queryClient = useQueryClient(); // Obter o cliente do React Query

  // Configurar a mutation para incrementar o erro
  const mutation = useMutation({
    mutationFn: incrementErrorCount,
    onSuccess: () => {
      // Invalidar queries relacionadas aos flashcards para buscar dados atualizados
      // Isso garante que a lista de "mais errados" seja atualizada na próxima vez que for carregada
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
      console.log('Contador de erro incrementado e query invalidada.');
    },
    onError: (error) => {
      console.error("Erro ao incrementar contador de erro:", error);
      // Adicionar feedback para o usuário aqui, se necessário
    },
  });

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setIsFront(true);
  };

  const handleFlip = () => {
    setIsFront((prevIsFront) => !prevIsFront);
  };

  const handleMarkCorrect = () => {
    // Lógica para marcar como correto
    handleNext();
  };

  const handleMarkIncorrect = () => {
    // Lógica para marcar como incorreto
    if (currentFlashcard) {
      console.log(`Marcando incorreto e incrementando erro para flashcard ID: ${currentFlashcard.id}`);
      mutation.mutate(currentFlashcard.id); // Chamar a mutation com o ID do flashcard
    }
    handleNext(); // Avança para o próximo card independentemente do sucesso/erro da mutation por enquanto
  };

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [dialogImageUrl, setDialogImageUrl] = useState<string | null>(null);

  // handler para abrir o modal da imagem
  const handleImageClick = (url: string) => {
    setDialogImageUrl(url);
    setImageDialogOpen(true);
  }

  // handler para fechar o modal
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
          <img
            src={currentFlashcard.imageUrl}
            alt="Imagem da resposta"
            className="mt-4 max-w-full h-auto rounded shadow-md cursor-pointer"
            style={{ maxHeight: 200 }}
            onClick={() => handleImageClick(currentFlashcard.imageUrl!)}
          />
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
        <div className="mt-4 flex justify-center gap-4"> {/* Adiciona espaçamento e centraliza */}
          <Button variant="outlined" onClick={handleFlip}> {/* Estilo para o botão de virar */}
            {isFront ? 'Ver Resposta' : 'Ver Pergunta'}
          </Button>
          {/* Mostra os botões de correto/incorreto apenas no verso */}
          {!isFront && (
            <>
              <Button variant="contained" color="success" onClick={handleMarkCorrect}>Correto</Button> {/* Estilo para o botão correto */}
              <Button variant="contained" color="error" onClick={handleMarkIncorrect}>Incorreto</Button> {/* Estilo para o botão incorreto */}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyMode;