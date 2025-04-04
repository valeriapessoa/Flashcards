"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Button,
  TextField,
  IconButton,
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { PhotoCamera } from '@mui/icons-material';
import axios from "axios";

const CreateFlashcard: React.FC<{}> = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!session?.user?.id) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('userId', session.user.id);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post("http://localhost:5000/api/flashcards/create", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });
    } catch (error) {
      setError("Erro ao criar o flashcard. Tente novamente.");
      console.error("Error creating flashcard:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else {
        console.error("Request error:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [session, title, description, tags]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Criar Flashcard
        </Typography>
        <Card variant="outlined">
          <CardContent>
            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                margin="normal"
                required
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                label="Tags (separadas por vírgula)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                margin="normal"
              />
              <Box sx={{ mt: 2 }}>
                <IconButton color="primary" component="label">
                  <PhotoCamera />
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setImage(file);
                      setImageUrl(null);
                    }}
                  />
                </IconButton>
                {image && (
                  <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                    {image.name}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button
                  onClick={() => router.push("./")}
                  variant="outlined"
                  color="secondary"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Criar"}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Container>
  );
};

export default CreateFlashcard;
