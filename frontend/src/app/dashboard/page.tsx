'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import UserStatsCard from '../../components/UserStatsCard';
import ScoreCard from '../../components/ScoreCard';
import AccessDeniedMessage from '../../components/AccessDeniedMessage';

interface UserStats {
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalReviews: number;
}

const Dashboard: React.FC = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (!session) {
    return <AccessDeniedMessage />;
  }

  if (!stats) {
    return (
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Loading stats...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <UserStatsCard stats={stats} />
      <ScoreCard score={stats.score} />
    </Container>
  );
};

export default Dashboard;