'use client';

import React from 'react';
import { Typography, Container, Box, useTheme } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import StudyMode from '@/components/StudyMode';
import { Flashcard } from '@/types';
import { fetchFlashcards } from '@/lib/api';
import { CircularProgress, Button, Alert } from '@mui/material';
import EmptyState from '../../components/EmptyState';

const StudyPage = () => {
  const { status, data: session } = useSession();
  const theme = useTheme();
  const router = useRouter();

  const {
    data: flashcards = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Flashcard[], Error>({
    queryKey: ['flashcards'],
    queryFn: fetchFlashcards,
    enabled: !!session,
  });

  if (status === 'loading') return null;
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <>
      <Header />
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        sx={{
          py: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          {session ? (
            <>
              <Typography variant="h4" gutterBottom textAlign="center">
                📚 Modo de Estudo
              </Typography>
              <Typography variant="body1" paragraph textAlign="center">
                Pratique seus flashcards aqui! 🚀
              </Typography>
              <Box sx={{ mt: 4 }}>
                {isLoading && (
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" my={3} aria-live="polite">
                    <CircularProgress />
                    <Typography color="text.secondary" mt={2}>Carregando flashcards, por favor aguarde...</Typography>
                  </Box>
                )}
                {isError && (
                  <Alert severity="error" action={
                    <Button color="inherit" size="small" onClick={() => refetch()}>
                      Tentar novamente
                    </Button>
                  }>
                    Erro ao carregar flashcards: {(error as Error)?.message || 'Erro desconhecido'}
                  </Alert>
                )}
                {flashcards?.length === 0 && !isLoading && !isError && (
                  <EmptyState
                    icon="⚠️"
                    title="Nenhum flashcard encontrado."
                    subtitle="Crie um novo flashcard para começar seus estudos."
                    buttonText="➕ Criar Flashcard"
                    buttonHref="/criar-flashcard"
                  />
                )}
                {!isLoading && !isError && flashcards.length > 0 && (
                  <StudyMode flashcards={flashcards} />
                )}
              </Box>
            </>
          ) : null}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default StudyPage;
