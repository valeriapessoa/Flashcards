import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import StudyMode from '../components/StudyMode';
import { Flashcard } from '../types';

const fetchFlashcards = async () => {
  const response = await axios.get('/api/flashcards');
  return response.data;
};

const StudyPage: React.FC = () => {
  const { data: flashcards, isLoading, error } = useQuery<Flashcard[]>('flashcards', fetchFlashcards);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro ao carregar flashcards</div>;

  return (
    <div>
      <h1>Modo de Estudo</h1>
      {flashcards && <StudyMode flashcards={flashcards} />}
    </div>
  );
};

export default StudyPage;