'use client';

import React from 'react';
import { Typography, Container, Box, useTheme } from '@mui/material';
import FlashcardList from '../../components/FlashcardList';
import AccessDeniedMessage from '../../components/AccessDeniedMessage';
import { useSession } from 'next-auth/react';
import AuthGuard from "@/components/AuthGuard";
import PageNavigation from '../../components/PageNavigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const RevisaoInteligentePage = () => {
  const { data: session } = useSession();
  const theme = useTheme();

  return (
    <>
      <Header />
      <AuthGuard>
        <Box
          minHeight="75vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.default} 100%)`,
            py: { xs: 2, md: 4 },
          }}
        >
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <PageNavigation />
            {session ? (
              <>
                <Typography variant="h4" gutterBottom textAlign="center">
                  🧠 Revisão Inteligente
                </Typography>
                <Typography variant="body1" paragraph textAlign="center">
                  Aqui estão os flashcards que você mais errou e precisa revisar.
                </Typography>
                <FlashcardList fetchPath="/api/flashcards/revisao-inteligente" />
              </>
            ) : (
              <AccessDeniedMessage />
            )}
          </Container>
        </Box>
      </AuthGuard>
      <Footer />
    </>
  );
};

export default RevisaoInteligentePage;