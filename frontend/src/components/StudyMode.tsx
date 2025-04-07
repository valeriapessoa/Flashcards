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
        {!isFront && currentFlashcard.imageUrl && (
          <img src={currentFlashcard.imageUrl} alt={currentFlashcard.title} className="mt-4 max-w-full h-auto" />
        )}
        <div>
          <Button onClick={handleFlip}>
            {isFront ? 'Ver Resposta' : 'Ver Pergunta'}
          </Button>
          <Button onClick={handleMarkCorrect}>Correto</Button>
          <Button onClick={handleMarkIncorrect}>Incorreto</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyMode;