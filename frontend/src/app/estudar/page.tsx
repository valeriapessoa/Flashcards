'use client';

import React from 'react';
import { Typography, Container, Box, useTheme } from '@mui/material';
import { useSession } from 'next-auth/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import StudySession from '../../components/StudySession';
import { useQuery } from '@tanstack/react-query';

const StudyPage = () => {
  const { status, data: session } = useSession();
  const theme = useTheme();
  const router = useRouter();

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
Modo de Estudo
              </Typography>
              <Typography variant="body1" paragraph textAlign="center">
                Pratique seus flashcards aqui! 🚀
              </Typography>
              <Box sx={{ mt: 4 }}>
                <StudySession 
                  fetchPath="/api/flashcards"
                  emptyStateTitle="Nenhum flashcard disponível para estudo"
                  emptyStateSubtitle="Você ainda não criou nenhum flashcard. Comece criando seus primeiros cards!"
                  emptyStateButtonText="Criar Flashcards"
                  emptyStateButtonHref="/criar-flashcard"
                />
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
