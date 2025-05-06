'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Button,
  Container,
  LinearProgress, // Para barra de progresso
  Paper, // Para envolver o resumo
  useTheme,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFlashcards, incrementErrorCount } from '../lib/api'; // Precisaremos criar incrementErrorCount
import Flashcard from './Flashcard';
import IntelligentReviewCard from './IntelligentReviewCard';
import EmptyState from './EmptyState';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Ícone para sucesso
import ReplayIcon from '@mui/icons-material/Replay'; // Ícone para repetir
import AssessmentIcon from '@mui/icons-material/Assessment'; // Ícone para revisão inteligente
import { useRouter } from 'next/navigation'; // Para navegação

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
  cardComponent?: React.ComponentType<{
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
    tags?: string[];
    onCorrect: (id: number) => void;
    onIncorrect: (id: number) => void;
    currentCardIndex: number;
    totalCards: number;
    onPrevious: () => void;
    onNext: () => void;
  }>;
}

const StudySession: React.FC<StudySessionProps> = ({ fetchPath = '/api/flashcards', cardComponent = Flashcard }) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const queryClient = useQueryClient();
  const theme = useTheme();
  const router = useRouter();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [localFlashcards, setLocalFlashcards] = useState<FlashcardData[]>([]); // Estado local para os cards da sessão

  // Busca inicial dos flashcards
  const {
    data: initialFlashcards = [],
    isLoading,
    isError,
    error,
    refetch, // Para reiniciar a sessão
  } = useQuery<FlashcardData[], Error>({
    queryKey: ['studySessionFlashcards', fetchPath],
    queryFn: () => fetchFlashcards(fetchPath),
    enabled: isAuthenticated,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 0, // Atualiza dados automaticamente quando necessário
  });

  // Função para atualizar a sessão quando novos flashcards são criados
  const updateSession = () => {
    refetch();
  };

  // Mutation para incrementar o contador de erros
  const incrementErrorMutation = useMutation({
    mutationFn: incrementErrorCount,
    onError: (error) => {
      console.error("Erro ao incrementar contador de erros:", error);
      // Adicionar feedback visual para o usuário (ex: Toast)
    },
    onSuccess: () => {
      // Opcional: Invalidar queries relacionadas se necessário,
      // mas para a revisão inteligente, talvez não seja preciso invalidar imediatamente
      // queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    }
  });

  // Efeito para inicializar o estado local quando os dados da query carregam
  useEffect(() => {
    if (initialFlashcards.length > 0) {
      setLocalFlashcards(initialFlashcards);
      // Reseta o estado da sessão se os dados mudarem (ex: refetch)
      setCurrentCardIndex(0);
      setSessionComplete(false);
      setCorrectCount(0);
      setIncorrectCount(0);
    } else if (!isLoading && !isError) {
        // Se não há cards e não está carregando/erro, a sessão pode ser considerada completa (vazia)
        setSessionComplete(true);
    }
  }, [initialFlashcards, isLoading, isError]);


  const goToNextCard = () => {
    if (currentCardIndex < localFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      // Atualiza o contador de cards restantes
      const remainingCards = localFlashcards.length - (currentCardIndex + 1);
      queryClient.setQueryData(['studySessionFlashcards', fetchPath], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          remainingCards
        };
      });
    }
  };

  const handleCorrect = () => {
    setCorrectCount(correctCount + 1);
    if (currentCardIndex < localFlashcards.length - 1) {
      goToNextCard();
    } else {
      setSessionComplete(true);
      // Garante que a soma de acertos e erros seja igual ao total de cards
      const totalCards = localFlashcards.length;
      // O último card já foi contado como acerto, então não precisamos ajustar
      setIncorrectCount(totalCards - correctCount);
    }
  };

  const handleIncorrect = () => {
    setIncorrectCount(incorrectCount + 1);
    if (currentCardIndex < localFlashcards.length - 1) {
      goToNextCard();
    } else {
      setSessionComplete(true);
      // Garante que a soma de acertos e erros seja igual ao total de cards
      const totalCards = localFlashcards.length;
      // O último card já foi contado como erro, então não precisamos ajustar
      setCorrectCount(totalCards - incorrectCount);
    }
  };

  const handleRestartSession = () => {
    // Reseta todos os estados
    setCurrentCardIndex(0);
    setSessionComplete(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    // Invalida as queries e refetch
    queryClient.invalidateQueries({ queryKey: ['studySessionFlashcards', fetchPath] });
    refetch();
  };

  // ----- Renderização -----

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
    const errorMessage = (error as any)?.response?.data?.message || error.message || "Erro desconhecido.";
    return <Alert severity="error">Erro ao carregar flashcards para revisão: {errorMessage}</Alert>;
  }

  // Estado Vazio (após carregamento, sem erro, mas sem cards)
  if (!isLoading && !sessionComplete && localFlashcards.length === 0) {
     return (
        <EmptyState
          icon="🎉"
          title="Nenhum flashcard disponível para estudar"
          subtitle="Você ainda não criou nenhum flashcard. Comece criando seus primeiros cards!"
          buttonText="Criar mais Flashcards"
          buttonHref="/criar-flashcard"
        />
      );
  }

  // Sessão em Andamento
  const currentCard = localFlashcards[currentCardIndex];

  const progress = ((currentCardIndex + 1) / localFlashcards.length) * 100;

  // Quando terminar de estudar todos os cards
  if (currentCardIndex === localFlashcards.length - 1) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            mt: 8, // Espaço maior do topo
            mb: 8, // Espaço maior na base
            p: 4, // Padding interno
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 2,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            🎉 Parabéns! Você terminou de estudar todos os flashcards.
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
            ✅ Acertos: {correctCount}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'error.main' }}>
            ❌ Erros: {incorrectCount}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            O que você gostaria de fazer agora?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleRestartSession}
              startIcon={<ReplayIcon />}
              sx={{ mb: 1 }}
            >
              Estudar Novamente
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push('/revisao-inteligente')}
              startIcon={<AssessmentIcon />}
              sx={{ mb: 1 }}
            >
              Revisão Inteligente
            </Button>
            <Box sx={{ mt: 4 }}>
              <StudySession fetchPath="/api/flashcards/revisao-inteligente" cardComponent={IntelligentReviewCard} />
            </Box>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ width: '100%', mb: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 0.5 }}>
          Card {currentCardIndex + 1} de {localFlashcards.length}
        </Typography>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
      {currentCard && (
        <Flashcard
          key={currentCard.id}
          id={currentCard.id}
          title={currentCard.title}
          description={currentCard.description}
          imageUrl={currentCard.imageUrl}
          backImageUrl={currentCard.backImageUrl}
          tags={currentCard.tags?.map(tag => tag.text) || []}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
          currentCardIndex={currentCardIndex}
          totalCards={localFlashcards.length}
          onPrevious={() => {
            if (currentCardIndex > 0) {
              setCurrentCardIndex(currentCardIndex - 1);
            }
          }}
          onNext={() => {
            if (currentCardIndex < localFlashcards.length - 1) {
              setCurrentCardIndex(currentCardIndex + 1);
            }
          }}
        />
      )}
    </Container>
  );
}

export default StudySession;