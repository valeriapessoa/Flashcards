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
import EmptyState from './EmptyState';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Ícone para sucesso
import ReplayIcon from '@mui/icons-material/Replay'; // Ícone para repetir
import HomeIcon from '@mui/icons-material/Home'; // Ícone para voltar
import { useRouter } from 'next/navigation'; // Para navegação

interface FlashcardData {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: { id: number; text: string }[];
  errorCount?: number;
}

interface StudySessionProps {
  fetchPath?: string;
}

const StudySession: React.FC<StudySessionProps> = ({ fetchPath = '/api/flashcards/revisao-inteligente' }) => {
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
    // Não queremos refetch automático aqui, controlaremos manualmente
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Garante que busca ao montar
    staleTime: Infinity, // Considera os dados frescos até invalidarmos manualmente
  });

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
    } else {
      setSessionComplete(true);
    }
  };

  const handleCorrect = (id: number) => {
    setCorrectCount(correctCount + 1);
    // Poderíamos adicionar lógica para marcar como 'menos prioritário' no futuro
    goToNextCard();
  };

  const handleIncorrect = (id: number) => {
    setIncorrectCount(incorrectCount + 1);
    incrementErrorMutation.mutate(id); // Chama a API para incrementar o erro
    goToNextCard();
  };

  const handleRestartSession = () => {
    // Reinicia buscando os dados novamente
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
  if (!isLoading && localFlashcards.length === 0 && !sessionComplete) {
     return (
        <EmptyState
          icon="🎉"
          title="Nenhum flashcard para revisar agora!"
          subtitle="Você está em dia com seus estudos ou não errou nenhum card recentemente. Continue assim!"
          buttonText="Criar mais Flashcards"
          buttonHref="/criar-flashcard"
        />
      );
  }

  // Sessão Completa
  if (sessionComplete) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mt: 4, textAlign: 'center' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom>Revisão Concluída!</Typography>
          <Typography variant="h6" gutterBottom>Resumo:</Typography>
          <Typography>✅ Acertos: {correctCount}</Typography>
          <Typography>❌ Erros: {incorrectCount}</Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-around', gap: 2, flexDirection: { xs: 'column', sm: 'row'} }}>
            <Button
              variant="contained"
              onClick={handleRestartSession}
              startIcon={<ReplayIcon />}
            >
              Revisar Novamente
            </Button>
            <Button
              variant="outlined"
              onClick={() => router.push('/')} // Volta para a home ou outra página
              startIcon={<HomeIcon />}
            >
              Voltar ao Início
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Sessão em Andamento
  const currentCard = localFlashcards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / localFlashcards.length) * 100;

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
          key={currentCard.id} // Key para garantir re-renderização ao mudar de card
          id={currentCard.id}
          title={currentCard.title}
          description={currentCard.description}
          imageUrl={currentCard.imageUrl}
          tags={currentCard.tags?.map(tag => tag.text)}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      )}
    </Container>
  );
};

export default StudySession;