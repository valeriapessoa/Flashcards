'use client';

import React from 'react';
import { Typography, Container } from '@mui/material';
import FlashcardList from '../../components/FlashcardList';

const RevisaoInteligentePage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        🧠 Revisão Inteligente
      </Typography>
      <Typography variant="body1" paragraph textAlign="center">
        Aqui estão os flashcards que você mais errou e precisa revisar.
      </Typography>
      {/* Usa o caminho relativo da API para garantir que a requisição seja feita corretamente */}
      <FlashcardList fetchPath="/api/flashcards/mais-errado" />
    </Container>
  );
};

export default RevisaoInteligentePage;