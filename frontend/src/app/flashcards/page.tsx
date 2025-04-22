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
  Box,
  useTheme
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteFlashcard, fetchFlashcards } from "../../lib/api";
import { useSession } from "next-auth/react";
import AccessDeniedMessage from "../../components/AccessDeniedMessage";
import PageNavigation from '../../components/PageNavigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface Tag {
  id: number;
  text: string;
}

interface Flashcard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  tags: Tag[];
}

const Flashcards: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const theme = useTheme();

  // useQuery sempre chamado, só habilita se autenticado
  const { data: flashcards = [], isLoading, error } = useQuery<Flashcard[], Error>({
    queryKey: ["flashcards"],
    queryFn: () => fetchFlashcards(),
    enabled: !!session,
  });

  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const handleEdit = (id: number) => {
    router.push(`/editar-flashcard?id=${id}`);
  };

  const mutation = useMutation<unknown, Error, number>({
    mutationFn: (id: number) => deleteFlashcard(id.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      setDeleteId(null);
    },
  });

  const handleDelete = () => {
    if (deleteId !== null) {
      mutation.mutate(deleteId);
    }
  };

  if (!session) {
    return <AccessDeniedMessage />;
  }

  return (
    <>
      <Header />
      <Box
        minHeight="75vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.default} 100%)`,
          py: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <PageNavigation />
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
            <Typography color="error" align="center">Erro ao carregar flashcards: {error.message}</Typography>
          ) : flashcards.length > 0 ? (
            <Grid container spacing={3}>
              {flashcards.map((flashcard: Flashcard) => (
                <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                  <Card sx={{ boxShadow: 4, borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">
                        {flashcard.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                        {flashcard.description}
                      </Typography>
                      {flashcard.imageUrl && (
                        <Box component="img"
                          src={flashcard.imageUrl}
                          alt={flashcard.title}
                          sx={{ width: "100%", borderRadius: 2, objectFit: "cover", maxHeight: 140, mb: 1 }}
                          loading="lazy"
                        />
                      )}
                      <Box mt={2} display="flex" flexWrap="wrap" gap={1} alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          🔖 Tags:
                        </Typography>
                        {flashcard.tags.map((tag, index) => (
                          <Typography
                            key={`${tag.text}-${index}`}
                            variant="caption"
                            color="primary"
                            sx={{ backgroundColor: theme.palette.primary.light, px: 1.5, py: 0.5, borderRadius: 1 }}
                          >
                            {tag.text}
                          </Typography>
                        ))}
                      </Box>
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
            <Box textAlign="center" mt={6}>
              <Typography color="text.secondary">
                Nenhum flashcard encontrado. Comece criando um! 📌
              </Typography>
            </Box>
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
      </Box>
      <Footer />
    </>
  );
};

export default Flashcards;
