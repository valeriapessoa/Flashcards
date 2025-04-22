'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, Paper, Box, useTheme } from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import UserStatsCard from '../../components/UserStatsCard';
import ScoreCard from '../../components/ScoreCard';
import AccessDeniedMessage from '../../components/AccessDeniedMessage';
import AuthGuard from '@/components/AuthGuard';
import PageNavigation from '../../components/PageNavigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface UserStats {
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalReviews: number;
}

const Dashboard: React.FC = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!session) return; // só busca se autenticado
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, [session]);

  if (!session) {
    return <AccessDeniedMessage />;
  }

  if (!stats) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Removido o background para deixar o fundo sem cor
        }}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3, width: '100%', maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Carregando estatísticas...
            </Typography>
          </Paper>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '75vh',
          // Removido o background para deixar o fundo sem cor
          py: { xs: 2, md: 4 },
        }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxWidth="sm" sx={{ p: 0 }}>
          <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
            <CardContent>
              <PageNavigation />
              <Typography variant="h4" gutterBottom align="center">
                Olá, {session?.user?.name || 'usuário'}!
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" mb={2}>
                Aqui está um resumo do seu desempenho com os flashcards.
              </Typography>
              <UserStatsCard stats={stats} />
              <ScoreCard score={stats.score} />
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default function Page() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}