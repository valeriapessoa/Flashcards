"use client";

import React from "react";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  useTheme,
  IconButton,
  CardMedia,
  Chip
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteFlashcard, fetchFlashcards } from "../../lib/api";
import { useSession } from "next-auth/react";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import EmptyState from '../../components/EmptyState';

interface Tag {
  id: number;
  text: string;
}

interface Flashcard {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  backImageUrl?: string;
  tags: Array<{ id: number; text: string }>;
  userId: number;
}

const Flashcards: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
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
      queryClient.invalidateQueries({ queryKey: ["flashcard"] });
      setDeleteId(null);
    },
  });

  const handleDelete = () => {
    if (deleteId !== null) {
      mutation.mutate(deleteId);
    }
  };

  // Estado para modal de imagem ampliada
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  const [dialogImageUrl, setDialogImageUrl] = React.useState<string | null>(null);

  const handleImageClick = (url: string) => {
    setDialogImageUrl(url);
    setImageDialogOpen(true);
  };
  const handleDialogClose = () => {
    setImageDialogOpen(false);
    setDialogImageUrl(null);
  };

  // Correção: renderização condicional após hooks
  if (status === "loading") {
    return (
      <Box minHeight="75vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }
  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return null;
  }

  return (
    <>
      <Header />
      <Box sx={{
        minHeight: "75vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 2, md: 4 },
      }}>
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            📚 Flashcards
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/criar-flashcard")}
            >
              ➕ Criar Novo Flashcard
            </Button> */}
          </Box>
          {isLoading ? (
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">Erro ao carregar flashcards: {error.message}</Typography>
          ) : flashcards.length > 0 ? (
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {flashcards.map((flashcard) => (
                  <Card key={flashcard.id} sx={{ 
                    p: 2, 
                    boxShadow: 2,
                    border: '1px solid rgba(0,0,0,0.12)',
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                      border: '1px solid rgba(0,0,0,0.2)',
                      backgroundColor: 'rgba(0,0,0,0.02)'
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {flashcard.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(flashcard.id)}
                          sx={{ textTransform: 'none' }}
                        >
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
                      </Box>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2
                    }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          mb: 0
                        }}
                      >
                        {flashcard.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      {flashcard.tags.map((tag) => (
                        <Chip
                          key={tag.id}
                          label={tag.text}
                          sx={{ 
                            backgroundColor: theme.palette.primary.light,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            color: '#fff'
                          }}
                        />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {flashcard.imageUrl && (
                        <img
                          src={flashcard.imageUrl as string}
                          alt={flashcard.title}
                          style={{ 
                            maxWidth: '100px', 
                            height: 'auto',
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                          onClick={() => handleImageClick(flashcard.imageUrl!)}
                        />
                      )}
                      {flashcard.backImageUrl && (
                        <img
                          src={flashcard.backImageUrl as string}
                          alt={`${flashcard.title} - verso`}
                          style={{ 
                            maxWidth: '100px', 
                            height: 'auto',
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                          onClick={() => handleImageClick(flashcard.backImageUrl!)}
                        />
                      )}
                    </Box>
                  </Card>
                ))}
              </Box>
            </Box>
          ) : (
            <EmptyState
              icon="⚠️"
              title="Nenhum flashcard encontrado."
              subtitle="Crie um novo flashcard para começar sua coleção."
              buttonText="➕ Criar Flashcard"
              buttonHref="/criar-flashcard"
            />
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

          {/* Modal de imagem ampliada fullscreen */}
          <Dialog open={imageDialogOpen} onClose={handleDialogClose} maxWidth="md" fullScreen>
            <DialogContent sx={{ position: 'relative', p: 0, bgcolor: 'black', width: '100vw', height: '100vh', overflow: 'hidden' }}>
              <IconButton
                aria-label="Fechar"
                onClick={handleDialogClose}
                sx={{ position: 'absolute', top: 8, right: 8, color: 'white', zIndex: 1 }}
              >
                <CloseIcon />
              </IconButton>
              {dialogImageUrl && (
                <img
                  src={dialogImageUrl}
                  alt="Imagem ampliada"
                  style={{
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'contain',
                    display: 'block',
                    margin: 0,
                    background: 'black',
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Flashcards;
