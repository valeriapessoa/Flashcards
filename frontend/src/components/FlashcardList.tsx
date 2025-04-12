'use client';

import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Flashcard from './Flashcard';

interface FlashcardData {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: { id: number; text: string }[];
  errorCount?: number;
}

interface FlashcardListProps {
  endpoint: string;
}

const FlashcardList: React.FC<FlashcardListProps> = ({ endpoint }) => {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (status === 'authenticated' && session?.accessToken) {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(endpoint, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          setFlashcards(response.data);
        } catch (err: any) {
          console.error("Erro ao buscar flashcards:", err);
          setError(err.response?.data?.message || err.message || "Erro desconhecido ao buscar flashcards.");
        } finally {
          setLoading(false);
        }
      } else if (status === 'loading') {
        setLoading(true);
      } else {
        setLoading(false);
        setError("Você precisa estar logado para ver esta lista.");
      }
    };

    fetchFlashcards();
  }, [endpoint, session, status]);

  const handleMarkAsReviewed = (id: number) => {
    setFlashcards((prevFlashcards) =>
      prevFlashcards.filter((flashcard) => flashcard.id !== id)
    );
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (flashcards.length === 0 && !loading) {
    return <Typography>Nenhum flashcard para revisar no momento!</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {flashcards.map((flashcard) => (
        <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
          <Flashcard
            id={flashcard.id}
            title={flashcard.title}
            description={flashcard.description}
            imageUrl={flashcard.imageUrl}
            tags={flashcard.tags?.map(tag => tag.text)}
            onMarkAsReviewed={() => handleMarkAsReviewed(flashcard.id)}
            showReviewButton={true}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FlashcardList;