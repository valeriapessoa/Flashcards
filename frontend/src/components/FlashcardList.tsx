'use client';

import React, { useState } from 'react'; 
import { Grid, CircularProgress, Alert } from '@mui/material'; 
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query'; 
import { fetchFlashcards, markFlashcardAsReviewed } from '../lib/api'; 
import Flashcard from './Flashcard';
import EmptyState from './EmptyState'; 

interface FlashcardData {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: { id: number; text: string }[];
  errorCount?: number;
}

interface FlashcardListProps {
  fetchPath?: string; 
}

const FlashcardList: React.FC<FlashcardListProps> = ({ fetchPath = '/api/flashcards' }) => {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const {
    data: flashcards = [], 
    isLoading,
    isError,
    error,
  } = useQuery<FlashcardData[], Error>({ 
    queryKey: ['flashcards', fetchPath],
    queryFn: async () => {
      console.log('🔍 Chamando fetchFlashcards com path:', fetchPath);
      try {
        const result = await fetchFlashcards(fetchPath);
        console.log('📊 Resultado da API:', result);
        return result;
      } catch (error) {
        console.error('❌ Erro ao buscar flashcards:', error);
        throw error;
      }
    },
    enabled: isAuthenticated, 
    retry: 3, 
    retryDelay: 1000, 
  });

  const [reviewedFlashcardIds, setReviewedFlashcardIds] = useState<Set<number>>(new Set());

  const handleMarkAsReviewed = async (id: number) => {
    try {
      await markFlashcardAsReviewed(id);
      setReviewedFlashcardIds((prevIds) => new Set(prevIds).add(id));
    } catch (error) {
      console.error("Erro ao marcar flashcard como revisado:", error);
    }
  };

  console.log('💾 Flashcards recebidos:', flashcards);

  if (status === 'loading' || (isLoading && isAuthenticated)) {
    return <CircularProgress />;
  }

  if (status === 'unauthenticated') {
     return <Alert severity="warning">Você precisa estar logado para ver seus flashcards.</Alert>;
  }

  if (isError) {
    const errorMessage = (error as { response?: { data?: { message?: string } }, message?: string })?.response?.data?.message || error.message || "Erro desconhecido ao buscar flashcards.";
    return <Alert severity="error">Erro ao carregar flashcards: {errorMessage}</Alert>;
  }

  const visibleFlashcards = flashcards.filter((fc: FlashcardData) => !reviewedFlashcardIds.has(fc.id));
  
  console.log('👁️ Flashcards visíveis após filtro:', visibleFlashcards);

  if (visibleFlashcards.length === 0 && !isLoading) {
    console.log('❌ Nenhum flashcard visível encontrado');

    return (
      <EmptyState
        icon="⚠️"
        title="Nenhum flashcard encontrado."
        subtitle="Crie um novo flashcard para começar sua coleção."
        buttonText="➕ Criar Flashcard"
        buttonHref="/criar-flashcard"
      />
    );
  }

  return (
    <Grid container spacing={2}>
      {visibleFlashcards.map((flashcard: FlashcardData) => (
        <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
          <Flashcard
            id={flashcard.id}
            title={flashcard.title}
            description={flashcard.description}
            imageUrl={flashcard.imageUrl}
            tags={flashcard.tags?.map((tag: { id: number; text: string }) => tag.text)}
            onCorrect={() => handleMarkAsReviewed(flashcard.id)}
            onIncorrect={() => handleMarkAsReviewed(flashcard.id)}
            currentCardIndex={visibleFlashcards.indexOf(flashcard)}
            totalCards={visibleFlashcards.length}
            onPrevious={() => {}}
            onNext={() => {}}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FlashcardList;