"use client";

import React, { useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';

import { Flashcard } from '../types';

interface StudyModeProps {
  flashcards: Flashcard[];
}

const StudyMode: React.FC<StudyModeProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFront, setIsFront] = useState(true);

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
    handleNext();
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