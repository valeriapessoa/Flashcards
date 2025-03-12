"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Flashcard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: string;
}

const Flashcards: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get("/api/flashcards");
        setFlashcards(response.data);
      } catch (error) {
        console.error("Erro ao buscar flashcards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/flashcards/edit/${id}`);
  };

  const handleDelete = async () => {
    if (deleteId !== null) {
      try {
        await axios.delete(`/api/flashcards/${deleteId}`);
        setFlashcards((prev) => prev?.filter((flashcard) => flashcard.id !== deleteId));
      } catch (error) {
        console.error("Erro ao excluir flashcard:", error);
      } finally {
        setDeleteId(null);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        📚 Flashcards
      </Typography>

      {loading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : flashcards && flashcards.length > 0 ? (
        <Grid container spacing={3}>
          {flashcards.map((flashcard) => (
            <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {flashcard.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                    {flashcard.description}
                  </Typography>
                  {flashcard.imageUrl && (
                    <img
                      src={flashcard.imageUrl}
                      alt={flashcard.title}
                      style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }}
                    />
                  )}
                  <Typography variant="caption" color="primary" sx={{ mt: 1, display: "block" }}>
                    🔖 Tags: {flashcard.tags}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
                  <Button variant="outlined" size="small" onClick={() => handleEdit(flashcard.id)}>
                    ✏️ Editar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => setDeleteId(flashcard.id)}
                  >
                    🗑️ Excluir
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography textAlign="center" color="text.secondary">
          Nenhum flashcard encontrado. Comece criando um! 📌
        </Typography>
      )}

      {/* Modal de Confirmação para Exclusão */}
      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>Tem certeza de que deseja excluir este flashcard?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Flashcards;
