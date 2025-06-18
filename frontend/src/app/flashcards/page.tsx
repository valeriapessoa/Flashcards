"use client";

import React from "react";
import {
  Button,
  Container,
  Typography,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  useTheme,
  IconButton,
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
  // Todos os hooks devem vir primeiro, antes de qualquer lógica condicional
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const theme = useTheme();
  
  // Estados
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  const [dialogImageUrl, setDialogImageUrl] = React.useState<string | null>(null);

  // useQuery sempre chamado, só habilita se autenticado
  const { data: flashcards = [], isLoading, error } = useQuery<Flashcard[], Error>({
    queryKey: ["flashcards"],
    queryFn: () => fetchFlashcards(),
    enabled: !!session,
  });

  const mutation = useMutation<unknown, Error, number>({
    mutationFn: (id: number) => deleteFlashcard(id.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      queryClient.invalidateQueries({ queryKey: ["flashcard"] });
      setDeleteId(null);
    },
  });

  // Handlers
  const handleEdit = (id: number) => {
    router.push(`/editar-flashcard?id=${id}`);
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      mutation.mutate(deleteId);
    }
  };

  const handleImageClick = (url: string) => {
    setDialogImageUrl(url);
    setImageDialogOpen(true);
  };

  const handleDialogClose = () => {
    setImageDialogOpen(false);
    setDialogImageUrl(null);
  };

  // Redirecionamento para login quando não autenticado
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Renderização condicional após todos os hooks
  if (status === "loading" || status === "unauthenticated") {
    return (
      <Box minHeight="75vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Box sx={{
        minHeight: "75vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: { xs: 2, sm: 3 },
        px: { xs: 1, sm: 2 },
      }}>
        <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, width: '100%' }}>
          <Typography 
            variant="h4" 
            component="h1"
            align="center" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              mb: 2,
              fontSize: '1.75rem',
              lineHeight: 1.3,
              px: 1,
              color: 'text.primary'
            }}
          >
            Meus Flashcards
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-end' }, mb: { xs: 2, sm: 3 } }}>
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/criar-flashcard")}
            >
              ➕ Criar Novo Flashcard
            </Button> */}
          </Box>
          {isLoading ? (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center" sx={{ px: 2 }}>Erro ao carregar flashcards: {error.message}</Typography>
          ) : flashcards.length > 0 ? (
            <Box sx={{ width: '100%', overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                {flashcards.map((flashcard) => (
                  <Card key={flashcard.id} sx={{ 
                    p: 0,
                    boxShadow: 2,
                    border: '1px solid rgba(0,0,0,0.12)',
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: { xs: 'none', sm: 'translateY(-2px)' },
                      boxShadow: { xs: 2, sm: 4 },
                      border: '1px solid rgba(0,0,0,0.2)',
                      backgroundColor: { xs: 'transparent', sm: 'rgba(0,0,0,0.02)' }
                    }
                  }}>
                    {/* Barra de ações no topo */}
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      p: { xs: 1, sm: 1.5 },
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                    }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEdit(flashcard.id)}
                        sx={{ 
                          textTransform: 'none',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          py: { xs: 0.25, sm: 0.5 },
                          px: { xs: 1, sm: 1.5 },
                          minWidth: 'auto',
                          mr: 1,
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.04)'
                          }
                        }}
                      >
                        <Box component="span" sx={{ mr: 0.5 }}>✏️</Box>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Editar</Box>
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(flashcard.id)}
                        sx={{
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          py: { xs: 0.25, sm: 0.5 },
                          px: { xs: 1, sm: 1.5 },
                          minWidth: 'auto',
                          '&:hover': {
                            backgroundColor: 'error.dark'
                          }
                        }}
                      >
                        <Box component="span" sx={{ mr: 0.5 }}>🗑️</Box>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Excluir</Box>
                      </Button>
                    </Box>

                    {/* Conteúdo do card */}
                    <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          mb: 1.5,
                          fontSize: { xs: '1.1rem', sm: '1.25rem' },
                          fontWeight: 500,
                          color: 'text.primary'
                        }}
                      >
                        {flashcard.title}
                      </Typography>
                    </Box>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      px: { xs: 1.5, sm: 2 },
                      mt: -1
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
                          mb: 0,
                          width: '100%'
                        }}
                      >
                        {flashcard.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: { xs: 1.5, sm: 2 }, px: 1.5 }}>
                      {flashcard.tags.map((tag) => (
                        <Chip
                          key={tag.id}
                          label={tag.text}
                          sx={{ 
                            backgroundColor: theme.palette.primary.light,
                            px: { xs: 1, sm: 1.5 },
                            py: { xs: 0.25, sm: 0.5 },
                            borderRadius: 1,
                            color: '#fff',
                            height: { xs: '24px' },
                            '& .MuiChip-label': {
                              px: 0.5,
                              fontSize: { xs: '0.7rem', sm: '0.8125rem' }
                            }
                          }}
                        />
                      ))}
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: { xs: 1, sm: 2 },
                      mt: 0,
                      px: { xs: 1.5, sm: 2 },
                      pb: { xs: 1.5, sm: 2 },
                      flexWrap: 'wrap'
                    }}>
                      {flashcard.imageUrl && (
                        <Box 
                          component="img"
                          src={flashcard.imageUrl as string}
                          alt={flashcard.title}
                          onClick={() => handleImageClick(flashcard.imageUrl!)}
                          sx={{
                            width: { xs: '70px', sm: '90px', md: '100px' },
                            height: { xs: '70px', sm: '90px', md: '100px' },
                            objectFit: 'cover',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            border: '1px solid rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      )}
                      {flashcard.backImageUrl && (
                        <Box 
                          component="img"
                          src={flashcard.backImageUrl as string}
                          alt={`${flashcard.title} - verso`}
                          onClick={() => handleImageClick(flashcard.backImageUrl!)}
                          sx={{
                            width: { xs: '70px', sm: '90px', md: '100px' },
                            height: { xs: '70px', sm: '90px', md: '100px' },
                            objectFit: 'cover',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            border: '1px solid rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
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
          <Dialog 
            open={deleteId !== null} 
            onClose={() => setDeleteId(null)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              pb: 1,
              fontWeight: 500
            }}>
              Confirmar exclusão
            </DialogTitle>
            <DialogContent sx={{ 
              pb: 0,
              fontSize: { xs: '0.95rem', sm: '1rem' }
            }}>
              Tem certeza de que deseja excluir este flashcard?
            </DialogContent>
            <DialogActions sx={{ 
              px: 3, 
              pb: 2,
              pt: 1,
              gap: { xs: 1, sm: 2 },
              '& > button': {
                m: '0 !important',
                px: { xs: 2, sm: 3 },
                py: { xs: 0.75, sm: 0.875 },
                fontSize: { xs: '0.85rem', sm: '0.9375rem' },
                minWidth: { xs: '100px', sm: '120px' },
                '&:last-child': {
                  ml: '8px !important'
                }
              }
            }}>
              <Button 
                onClick={() => setDeleteId(null)} 
                variant="outlined"
                color="inherit"
                sx={{
                  borderColor: 'text.secondary',
                  color: 'text.primary',
                  '&:hover': {
                    borderColor: 'text.primary',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleDelete} 
                color="error" 
                variant="contained"
                disabled={mutation.isPending}
                sx={{
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(211, 47, 47, 0.5)',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }
                }}
              >
                {mutation.isPending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : 'Excluir'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Modal de imagem ampliada */}
          <Dialog 
            open={imageDialogOpen} 
            onClose={handleDialogClose} 
            maxWidth="xl" 
            fullScreen
            PaperProps={{
              sx: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(4px)'
              }
            }}
          >
            <DialogContent sx={{ 
              position: 'relative', 
              p: 0, 
              bgcolor: 'transparent', 
              width: '100vw', 
              height: '100vh', 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconButton
                aria-label="Fechar"
                onClick={handleDialogClose}
                sx={{ 
                  position: 'absolute', 
                  top: { xs: 8, sm: 16 },
                  right: { xs: 8, sm: 16 },
                  color: 'white', 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                  },
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                  zIndex: 1 
                }}
              >
                <CloseIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }} />
              </IconButton>
              {dialogImageUrl && (
                <Box
                  component="img"
                  src={dialogImageUrl}
                  alt="Imagem ampliada"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    margin: 'auto',
                    p: { xs: 2, sm: 4 },
                    transition: 'transform 0.2s',
                    cursor: 'zoom-out',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    '@media (orientation: portrait)': {
                      maxWidth: '95vw',
                      maxHeight: '90vh'
                    },
                    '@media (orientation: landscape)': {
                      maxWidth: '90vw',
                      maxHeight: '95vh'
                    }
                  }}
                  onClick={handleDialogClose}
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
