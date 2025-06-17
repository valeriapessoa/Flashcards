'use client';

import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status !== 'authenticated') {
    return null; // ou um componente de carregamento
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
              <Typography 
                variant="h4" 
                component="h1"
                align="center" 
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: '1.75rem',
                  lineHeight: 1.3,
                  px: 1
                }}
              >
                Modo de Estudo
              </Typography>
              <Typography 
                variant="subtitle1" 
                align="center" 
                color="text.secondary"
                sx={{ 
                  mb: { xs: 4, sm: 6, md: 8 },
                  maxWidth: '800px',
                  mx: 'auto',
                  px: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
                  lineHeight: { xs: 1.4, sm: 1.5 }
                }}
              >
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
