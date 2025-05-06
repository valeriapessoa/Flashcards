'use client';

import React from 'react';
import { Typography, Container, Box, useTheme } from '@mui/material'; // Removido Button não utilizado aqui
import { useSession } from 'next-auth/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import StudySession from '../../components/StudySession'; // Importa o novo componente

// Removido import de EmptyState, pois StudySession lida com isso

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
                Aqui estão os flashcards que você mais errou e precisa revisar. Foco total! 🚀
              </Typography>
              {/* Renderiza o componente de sessão de estudo */}
              <StudySession fetchPath="/api/flashcards/revisao-inteligente" />
            </>
          ) : null}
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default RevisaoInteligentePage;