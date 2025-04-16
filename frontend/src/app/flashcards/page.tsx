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
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"; // Corrigido para @tanstack/react-query
// Removida a importação direta do axios
import { deleteFlashcard, fetchFlashcards } from "../../lib/api"; // Importado fetchFlashcards
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

  // Usar a sintaxe de objeto para useQuery (v5+)
  const { data: flashcards = [], isLoading, error } = useQuery<Flashcard[], Error>({
    queryKey: ["flashcards"], // queryKey dentro do objeto
    queryFn: () => fetchFlashcards(), // Chama a função sem passar o contexto do useQuery
    // enabled: status === 'authenticated' // Opcional: garantir que só busca se autenticado
  });

  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const handleEdit = (id: number) => {
    router.push(`/editar-flashcard?id=${id}`);
  };

  // Usar a sintaxe de objeto para useMutation (v5+)
  const mutation = useMutation<unknown, Error, number>({ // Tipos: TData, TError, TVariables
    mutationFn: (id: number) => deleteFlashcard(id.toString()), // mutationFn dentro do objeto
    onSuccess: () => {
      // Usar sintaxe de objeto para invalidateQueries (v5+)
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      setDeleteId(null); // Fechar modal após sucesso
    },
    // onError: (err) => { // Opcional: tratar erros de mutação
    //   console.error("Erro ao deletar flashcard:", err);
    // }
  });

  const handleDelete = () => {
    if (deleteId !== null) {
      // A chamada mutate está correta, pois TVariables é number
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
      // Como flashcards tem valor padrão [], a verificação flashcards && é redundante
      // A verificação flashcards.length > 0 é suficiente
      ) : flashcards.length > 0 ? (
        <Grid container spacing={3}>
          {flashcards.map((flashcard: Flashcard) => ( // A tipagem aqui está correta
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
                <div className="mt-3 flex flex-wrap gap-2 items-center">
                  🔖 Tags: {flashcard.tags.map((tag, index) => (
                    <Typography
                      key={`${tag.text}-${index}`} // adiciona uma key única
                      variant="caption"
                      color="primary"
                      className="bg-blue-100 text-blue-800 px-3 py-1 my-2 rounded-md text-sm flex items-center gap-2"
                    >
                      {tag.text}
                    </Typography>
                  ))}
                </div>
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
