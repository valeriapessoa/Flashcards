"use client";

import React, { useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Importar useMutation e useQueryClient
import { incrementErrorCount } from '../lib/api'; // Importar a função da API
import { Flashcard } from '../types';
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
            className="mt-4 max-w-full h-auto rounded shadow-md"
          />
        )}
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