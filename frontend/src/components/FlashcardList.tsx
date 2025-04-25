'use client';

import React, { useState } from 'react'; // Removido useEffect
import { Grid, CircularProgress, Typography, Alert, Button, Box } from '@mui/material'; // Adicionado Alert, Button e Box
// Removido axios
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query'; // Importado useQuery
import { fetchFlashcards, markFlashcardAsReviewed } from '../lib/api'; // Importado markFlashcardAsReviewed
import Flashcard from './Flashcard';
import EmptyState from './EmptyState'; // Import do EmptyState
interface FlashcardData {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: { id: number; text: string }[];
  errorCount?: number;
}

interface FlashcardListProps {
  fetchPath?: string; // Caminho da API para buscar os flashcards
}

const FlashcardList: React.FC<FlashcardListProps> = ({ fetchPath = '/api/flashcards' }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  // Usar useQuery para buscar os flashcards
  const {
    data: flashcards = [], // Valor padrão como array vazio
    isLoading,
    isError,
    error,
  } = useQuery<FlashcardData[], Error>({ // Tipagem explícita para data e error
    // Chave da query inclui o path para diferenciar caches
    queryKey: ['flashcards', fetchPath],
    // Passa o path para a função fetchFlashcards corretamente dentro de uma arrow function
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
    enabled: isAuthenticated, // Só executa a query se o usuário estiver autenticado
    retry: 3, // Tentar no máximo 3 vezes em caso de erro
    retryDelay: 1000, // Esperar 1 segundo entre as tentativas
  });

  // Estado local para gerenciar quais flashcards foram "revisados" (removidos da lista visualmente)
  const [reviewedFlashcardIds, setReviewedFlashcardIds] = useState<Set<number>>(new Set());

  // Atualiza o estado local para esconder o flashcard revisado
  const handleMarkAsReviewed = async (id: number) => {
    try {
      // Chama a API para marcar o flashcard como revisado no banco de dados
      await markFlashcardAsReviewed(id);
      // Atualiza o estado local para esconder o flashcard da interface
      setReviewedFlashcardIds((prevIds) => new Set(prevIds).add(id));
    } catch (error) {
      console.error("Erro ao marcar flashcard como revisado:", error);
      // Opcionalmente, pode-se adicionar um alerta ou toast para informar o usuário sobre o erro
    }
  };

  // Log para depuração
  console.log('💾 Flashcards recebidos:', flashcards);

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
  
  // Log para depuração
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