'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid } from '@mui/material';
import axios from 'axios';
import UserStatsCard from '../../components/UserStatsCard';

interface UserStats {
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalReviews: number;
}

const Dashboard: React.FC = () => {
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
    </Container>
  );
};

export default Dashboard;