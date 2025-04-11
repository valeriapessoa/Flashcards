"use client";

import React from "react";
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
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axios from "axios";
import { deleteFlashcard } from "../../lib/api";

interface Flashcard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

const Flashcards: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: flashcards, isLoading, error } = useQuery<Flashcard[], Error>(
    "flashcards",
    async () => {
      const response = await axios.get("http://localhost:5000/api/flashcards");
      return response.data;
    }
  );

  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const handleEdit = (id: number) => {
    router.push(`/editar-flashcard?id=${id}`);
  };

  const mutation = useMutation(
    (id: number) => deleteFlashcard(id.toString()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("flashcards");
        setDeleteId(null);
      },
    }
  );

  const handleDelete = () => {
    if (deleteId !== null) {
      mutation.mutate(deleteId);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        📚 Flashcards
      </Typography>
      <Grid container justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/criar-flashcard")}
        >
          ➕ Criar Novo Flashcard
        </Button>
      </Grid>
      {isLoading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : error ? (
        <Typography color="error">Erro ao carregar flashcards: {error.message}</Typography>
      ) : flashcards && flashcards.length > 0 ? (
        <Grid container spacing={3}>
          {flashcards.map((flashcard: Flashcard) => (
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
                      loading="lazy"
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
