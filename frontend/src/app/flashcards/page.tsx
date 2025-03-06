import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Card, CardContent, CardActions, Grid } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Flashcard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: string;
}

const Flashcards: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[] | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get('/api/flashcards');
        setFlashcards(response.data);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    fetchFlashcards();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/edit-flashcard/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/flashcards/${id}`);
      setFlashcards(flashcards?.filter(flashcard => flashcard.id !== id));
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Flashcards
      </Typography>
      <Grid container spacing={3}>
        {flashcards?.map(flashcard => (
          <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  {flashcard.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {flashcard.description}
                </Typography>
                {flashcard.imageUrl && (
                  <img src={flashcard.imageUrl} alt={flashcard.title} style={{ width: '100%', marginTop: '10px' }} />
                )}
                <Typography variant="body2" color="text.secondary">
                  Tags: {flashcard.tags}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleEdit(flashcard.id)}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => handleDelete(flashcard.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Flashcards;