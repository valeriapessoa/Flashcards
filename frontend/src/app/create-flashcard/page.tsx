import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import axios from 'axios';

const CreateFlashcard: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }
    formData.append('tags', tags);

    try {
      await axios.post('/api/flashcards', formData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating flashcard:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Create Flashcard
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          required
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          label="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          margin="normal"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          style={{ marginTop: '16px' }}
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
          Create
        </Button>
      </Box>
    </Container>
  );
};

export default CreateFlashcard;