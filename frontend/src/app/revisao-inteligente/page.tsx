'use client';

import React from 'react';
import { Typography, Container, Box, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSession } from 'next-auth/react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import StudySession from '../../components/StudySession';
import { Card } from '../../components/StudySession';
import { useMutation } from '@tanstack/react-query';
import { markFlashcardAsReviewed } from '../../lib/api';

const RevisaoInteligentePage = () => {
  const { status, data: session } = useSession();
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

  React.useEffect(() => {
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
                Revisão Inteligente
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