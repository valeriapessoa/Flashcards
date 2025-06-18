'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
  Alert,
  Button,
  Container,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFlashcards, incrementErrorCount } from '../lib/api';
import {
  Replay as ReplayIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import Flashcard, { FlashcardProps } from './Flashcard';
import EmptyState from './EmptyState';
import { useRouter } from 'next/navigation';

interface FlashcardData {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  backImageUrl?: string;
  tags?: { id: number; text: string }[];
  errorCount?: number;
}

interface StudySessionProps {
  fetchPath?: string;
  cardComponent?: React.ComponentType<FlashcardProps>;
  id?: number;
  title?: string;
  description?: string;
  imageUrl?: string;
  backImageUrl?: string;
  tags?: string[];
  onCorrect?: (id: number) => void;
  onIncorrect?: (id: number) => void;
  currentCardIndex?: number;
  totalCards?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  emptyStateButtonText?: string;
  emptyStateButtonHref?: string;
}

// Exportar o componente Card para uso externo
export const Card = Flashcard;

export default function StudySession({
  fetchPath = '/api/flashcards',
  cardComponent: CardComponent = Flashcard,
  emptyStateTitle,
  emptyStateSubtitle,
  emptyStateButtonText,
  emptyStateButtonHref,
}: StudySessionProps) {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const queryClient = useQueryClient();
  const router = useRouter();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [localFlashcards, setLocalFlashcards] = useState<FlashcardData[]>([]);
  const [answeredCards, setAnsweredCards] = useState<Record<number, 'correct' | 'incorrect'>>({});

  const {
    data: initialFlashcards = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<FlashcardData[], Error>({
    queryKey: ['studySessionFlashcards', fetchPath],
    queryFn: () => fetchFlashcards(fetchPath),
    enabled: isAuthenticated,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 0,
  });

  const incrementErrorMutation = useMutation({
    mutationFn: incrementErrorCount,
    onError: (error) => {
      console.error("Erro ao incrementar contador de erros:", error);
    },
  });

  useEffect(() => {
    if (initialFlashcards.length > 0) {
      setLocalFlashcards(initialFlashcards);
      setCurrentCardIndex(0);
      setSessionComplete(false);
      setCorrectCount(0);
      setIncorrectCount(0);
    } else if (!isLoading && !isError) {
      setSessionComplete(true);
    }
  }, [initialFlashcards, isLoading, isError]);

  useEffect(() => {
    const totalCards = localFlashcards.length;
    if (correctCount > totalCards) setCorrectCount(totalCards);
    if (incorrectCount > totalCards) setIncorrectCount(totalCards);
  }, [correctCount, incorrectCount, localFlashcards.length]);

  const updateCounts = (answers: Record<number, 'correct' | 'incorrect'>) => {
    const correct = Object.values(answers).filter(v => v === 'correct').length;
    const incorrect = Object.values(answers).filter(v => v === 'incorrect').length;
    setCorrectCount(correct);
    setIncorrectCount(incorrect);
  };

  const handleCorrect = () => {
    const currentCard = localFlashcards[currentCardIndex];
    if (!currentCard) return;
    
    const newAnswers = { ...answeredCards, [currentCard.id]: 'correct' as const };
    setAnsweredCards(prev => ({
      ...prev,
      [currentCard.id]: 'correct' as const
    }));
    updateCounts(newAnswers);
    handleNext();
  };

  const handleIncorrect = async () => {
    const currentCard = localFlashcards[currentCardIndex];
    if (!currentCard) return;
    
    // Incrementa o contador de erros no servidor
    await incrementErrorMutation.mutateAsync(currentCard.id);
    
    // Atualiza o estado local das respostas
    const newAnswers = { ...answeredCards, [currentCard.id]: 'incorrect' as const };
    setAnsweredCards(prev => ({
      ...prev,
      [currentCard.id]: 'incorrect' as const
    }));
    updateCounts(newAnswers);
    handleNext();
  };

  const handleNext = () => {
    if (currentCardIndex < localFlashcards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else if (currentCardIndex === localFlashcards.length - 1) {
      // Só marca como completo após exibir o último cartão
      setCurrentCardIndex((prev) => prev + 1); // Avança para além do último
    }
  };

  const handleRestartSession = () => {
    setCurrentCardIndex(0);
    setSessionComplete(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setAnsweredCards({});
    queryClient.invalidateQueries({ queryKey: ['studySessionFlashcards', fetchPath] });
    refetch();
  };

  if (status === 'loading' || (isLoading && !localFlashcards.length)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    return <Alert severity="warning">Você precisa estar logado para iniciar uma sessão de estudo.</Alert>;
  }

  if (isError) {
    const errorMessage = (error as { response?: { data?: { message?: string } }, message?: string })?.response?.data?.message || error.message || "Erro desconhecido.";
    return <Alert severity="error">Erro ao carregar flashcards para revisão: {errorMessage}</Alert>;
  }

  if (!isLoading && localFlashcards.length === 0) {
    return (
      <EmptyState
        icon={fetchPath.includes('revisao-inteligente') ? "🎯" : "📚"}
        title={fetchPath.includes('revisao-inteligente') 
          ? "Nenhum flashcard precisa de revisão neste momento"
          : (emptyStateTitle || "Nenhum flashcard disponível para estudo")}
        subtitle={fetchPath.includes('revisao-inteligente')
          ? "Parabéns! Você não tem nenhum flashcard com erros para revisar. Continue estudando ou crie novos flashcards para melhorar seu aprendizado."
          : (emptyStateSubtitle || "Você ainda não criou nenhum flashcard. Comece criando seus primeiros cards!")}
        buttonText={fetchPath.includes('revisao-inteligente')
          ? "Estudar Flashcards"
          : (emptyStateButtonText || "Criar Flashcards")}
        buttonHref={fetchPath.includes('revisao-inteligente')
          ? "/estudar"
          : (emptyStateButtonHref || "/criar-flashcard")}
      />
    );
  }

  if (sessionComplete || currentCardIndex >= localFlashcards.length) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            mt: 8,
            mb: 8,
            p: 4,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            🎉 Parabéns!
          </Typography>
          <Typography variant="h5" gutterBottom>
            Você terminou o estudo!
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Aqui estão seus resultados:
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6">
              ✅ Acertos: {correctCount}
            </Typography>
            <Typography variant="h6">
              ❌ Erros: {incorrectCount}
            </Typography>
            <Typography variant="h6">
              📚 Total de Cards: {localFlashcards.length}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 4 }}>
            <Button variant="contained" onClick={handleRestartSession} startIcon={<ReplayIcon />}>
              Estudar Novamente
            </Button>
            {!fetchPath.includes('revisao-inteligente') && (
              <Button variant="outlined" onClick={() => router.push('/revisao-inteligente')} startIcon={<AssessmentIcon />}>
                Revisão Inteligente
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    );
  }

  // Renderização do cartão atual
  const CurrentCard = CardComponent || Flashcard;
  const currentCard = localFlashcards[currentCardIndex];

  return (
    <Container maxWidth="md">
      <Box sx={{ width: '100%', mb: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 0.5 }}>
          Card {currentCardIndex + 1} de {localFlashcards.length}
        </Typography>
        <LinearProgress variant="determinate" value={((currentCardIndex + 1) / localFlashcards.length) * 100} />
      </Box>
      {currentCard && (
        <CurrentCard
          id={currentCard.id}
          title={currentCard.title}
          description={currentCard.description}
          imageUrl={currentCard.imageUrl}
          backImageUrl={currentCard.backImageUrl}
          tags={currentCard.tags?.map((tag) => tag.text) || []}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
          currentCardIndex={currentCardIndex}
          totalCards={localFlashcards.length}
          onPrevious={() => setCurrentCardIndex((prev) => Math.max(prev - 1, 0))}
          onNext={handleNext}
        />
      )}
    </Container>
  );
}
