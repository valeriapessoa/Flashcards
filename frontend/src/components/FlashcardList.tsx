'use client';

import React, { useState } from 'react'; // Removido useEffect
import { Grid, CircularProgress, Typography, Alert } from '@mui/material'; // Adicionado Alert
// Removido axios
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query'; // Importado useQuery
import { fetchFlashcards } from '../lib/api'; // Importado fetchFlashcards de api.ts
import Flashcard from './Flashcard';
interface FlashcardData {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: { id: number; text: string }[];
  errorCount?: number;
}

// Removida a prop endpoint, pois a função fetchFlashcards já sabe o endpoint correto
const FlashcardList: React.FC = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  // Usar useQuery para buscar os flashcards
  const {
    data: flashcards = [], // Valor padrão como array vazio
    isLoading,
    isError,
    error,
  } = useQuery<FlashcardData[], Error>({ // Tipagem explícita para data e error
    queryKey: ['flashcards'], // Chave da query
    queryFn: fetchFlashcards, // Função que busca os dados (usando apiClient)
    enabled: isAuthenticated, // Só executa a query se o usuário estiver autenticado
  });

  // Estado local para gerenciar quais flashcards foram "revisados" (removidos da lista visualmente)
  const [reviewedFlashcardIds, setReviewedFlashcardIds] = useState<Set<number>>(new Set());

  // Removido o useEffect para fetch de dados, useQuery cuida disso.

  // Atualiza o estado local para esconder o flashcard revisado
  const handleMarkAsReviewed = (id: number) => {
    setReviewedFlashcardIds((prevIds) => new Set(prevIds).add(id));
  };

  // Renderização baseada nos estados do useQuery e status da sessão
  if (status === 'loading' || (isLoading && isAuthenticated)) {
    return <CircularProgress />;
  }

  if (status === 'unauthenticated') {
     return <Alert severity="warning">Você precisa estar logado para ver seus flashcards.</Alert>;
  }

  if (isError) {
    // Tenta extrair uma mensagem mais amigável do erro
    const errorMessage = (error as any)?.response?.data?.message || error.message || "Erro desconhecido ao buscar flashcards.";
    return <Alert severity="error">Erro ao carregar flashcards: {errorMessage}</Alert>;
  }

  // Filtra os flashcards que já foram marcados como revisados localmente
  const visibleFlashcards = flashcards.filter((fc: FlashcardData) => !reviewedFlashcardIds.has(fc.id));

  if (visibleFlashcards.length === 0 && !isLoading) {
    return <Typography>Nenhum flashcard encontrado ou todos já foram revisados!</Typography>;
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
            tags={flashcard.tags?.map((tag: { id: number; text: string }) => tag.text)} // Adiciona tipo para tag
            onMarkAsReviewed={() => handleMarkAsReviewed(flashcard.id)} // Usa a nova função
            showReviewButton={true} // Mantém o botão de revisão
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FlashcardList;