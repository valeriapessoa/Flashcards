"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

const CreateFlashcard: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError("Preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }
    formData.append("tags", tags);

    try {
      await axios.post("/api/flashcards", formData);
      router.push("/dashboard");
    } catch (error) {
      setError("Erro ao criar o flashcard. Tente novamente.");
      console.error("Error creating flashcard:", error);
    } finally {
      setLoading(false);
    }
  };

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
                <Button variant="contained" component="label">
                  Selecionar Imagem
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                  />
                </Button>
                {image && (
                  <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                    {image.name}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button
                  onClick={() => router.push("/dashboard")}
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
