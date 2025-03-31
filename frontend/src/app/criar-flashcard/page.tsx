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
import { CloudinaryContext, Cloudinary } from 'cloudinary-react';

const cloudinaryCloudName = 'flashcardsprojeto'; // Use seu Cloud Name aqui



const CreateFlashcard: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
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

    let cloudinaryUrl = null;
    if (image) {
      setLoading(true);
      try {
        cloudinaryUrl = await uploadImageToCloudinary(image);
        setImageUrl(cloudinaryUrl);
      } catch (uploadError) {
        setError("Erro ao fazer upload da imagem. Tente novamente.");
        console.error("Erro no upload da imagem:", uploadError);
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/flashcards", {
        title,
        description,
        imageUrl: cloudinaryUrl,
        tags: tags.split(",").map((tag: string) => tag.trim()),
        userId: session.user.id, // Usar o userId da sessão
      });
      router.push("/dashboard");
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
  };

  const uploadImageToCloudinary = useCallback(async (imageFile: File) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'flashcards_preset'); // Substitua pelo seu upload preset do Cloudinary

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Erro ao fazer upload para o Cloudinary:", error);
      throw error; // Rejeitar a promise para que o erro seja capturado no handleSubmit
    }
  }, []);


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
                      setImageUrl(null); // Limpar a URL anterior ao selecionar nova imagem
                    }}
                  />
                </IconButton>
                {image && !imageUrl && ( // Mostrar nome do arquivo apenas se a URL do Cloudinary ainda não estiver disponível
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
