'use client';

import React from 'react';
import { Typography, Container, Box, useTheme, Button, IconButton } from '@mui/material';
import { useSession } from 'next-auth/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import StudySession from '../../components/StudySession';
import { Card } from '../../components/StudySession';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { markFlashcardAsReviewed } from '../../lib/api';

const RevisaoInteligentePage = () => {
  const { status, data: session } = useSession();
  const theme = useTheme();
  const router = useRouter();

  const markAsReviewedMutation = useMutation({
    mutationFn: markFlashcardAsReviewed,
    onSuccess: () => {
      // Atualizar a lista de flashcards após marcar como revisado
      router.refresh();
    },
    onError: (error) => {
      console.error('Erro ao marcar como revisado:', error);
    },
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
                🧠 Revisão Inteligente
              </Typography>
              <Typography variant="body1" paragraph textAlign="center">
                Aqui estão os flashcards que você mais errou e precisa revisar. Foco total! 🚀
              </Typography>
              <Box sx={{ mt: 4 }}>
                <StudySession
                  fetchPath="/api/flashcards/revisao-inteligente"
                  cardComponent={(props) => (
                    <Box>
                      <Card {...props} />
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="large"
                          startIcon={<CheckCircleIcon />}
                          onClick={() => markAsReviewedMutation.mutate(props.id)}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            '&:hover': {
                              transform: 'scale(1.02)',
                              transition: 'transform 0.2s ease-in-out',
                            },
                          }}
                        >
                          Marcar como Revisado
                        </Button>
                      </Box>
                    </Box>
                  )}
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

export default RevisaoInteligentePage;