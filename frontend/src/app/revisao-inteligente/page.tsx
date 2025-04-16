'use client';

import React from 'react';
import { Typography, Container, Alert } from '@mui/material';
import FlashcardList from '../../components/FlashcardList';
import { useSession } from 'next-auth/react';

const RevisaoInteligentePage = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">
          Você precisa estar logado para acessar a revisão inteligente.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        🧠 Revisão Inteligente
      </Typography>
      <Typography variant="body1" paragraph textAlign="center">
        Aqui estão os flashcards que você mais errou e precisa revisar.
      </Typography>
      <FlashcardList fetchPath="/api/flashcards/revisao-inteligente" />
    </Container>
  );
};

export default RevisaoInteligentePage;