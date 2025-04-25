'use client';

import React from 'react';
import { Typography, Container, Box, useTheme, Button } from '@mui/material';
import FlashcardList from '../../components/FlashcardList';
import { useSession } from 'next-auth/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import EmptyState from '../../components/EmptyState'; // Import do EmptyState

const RevisaoInteligentePage = () => {
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
        minHeight="75vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          py: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          {session ? (
            <>
              <Typography variant="h4" gutterBottom textAlign="center">
                🧠 Revisão Inteligente
              </Typography>
              <Typography variant="body1" paragraph textAlign="center">
                Aqui estão os flashcards que você mais errou e precisa revisar.
              </Typography>
              <FlashcardList fetchPath="/api/flashcards/revisao-inteligente" />
              {/* Estado vazio padronizado */}
              {/* O FlashcardList já deve exibir o estado vazio, mas se quiser customizar: */}
              {/*
              <EmptyState
                icon="🧠"
                title="Nenhum flashcard para revisão."
                subtitle="Você está indo muito bem! Crie ou estude mais flashcards para aparecerem aqui."
                buttonText="➕ Criar Flashcard"
                buttonHref="/criar-flashcard"
              />
              */}
            </>
          ) : null}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default RevisaoInteligentePage;