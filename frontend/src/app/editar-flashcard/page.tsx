"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, QueryClient, QueryClientProvider } from "react-query";
import { Flashcard } from "../../types";
import { fetchFlashcard, updateFlashcard } from "../../lib/api";
import FlashcardForm from "../../components/FlashcardForm";
import { useSession } from "next-auth/react";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Box, Typography, Card, CardContent, Button, CircularProgress, useTheme } from '@mui/material';

const queryClient = new QueryClient();

const EditFlashcardPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const id = searchParams.get("id");

  const [flashcard, setFlashcard] = useState<Flashcard | null>(null);
  const [originalFlashcard, setOriginalFlashcard] = useState<Flashcard | null>(null);

  // useQuery sempre chamado, só habilita se houver id e sessão
  const { data, isLoading, isError } = useQuery(
    ["flashcard", id],
    () => fetchFlashcard(id as string),
    {
      enabled: !!id && !!session,
      onSuccess: (data) => {
        setFlashcard(data);
        setOriginalFlashcard(data);
      },
    }
  );

  const mutation = useMutation(
    async (formData: FormData) => {
      return await updateFlashcard(id as string, formData);
    },
    {
      onSuccess: () => {
        router.push("/flashcards");
      },
      onError: (error) => {
        console.error("Erro ao atualizar o flashcard:", error);
        alert("Erro ao atualizar o flashcard. Tente novamente.");
      },
    }
  );

  const handleSubmit = (updatedFlashcardData: Partial<Flashcard>, file: File | null) => {
    if (!originalFlashcard) return;

    const formData = new FormData();
    let hasChanges = false;

    if (updatedFlashcardData.title !== originalFlashcard.title) {
      formData.append("title", updatedFlashcardData.title || "");
      hasChanges = true;
    }
    if (updatedFlashcardData.description !== originalFlashcard.description) {
      formData.append("description", updatedFlashcardData.description || "");
      hasChanges = true;
    }
    if (file) {
      formData.append("image", file);
      hasChanges = true;
    }
    const currentTagsString = JSON.stringify(updatedFlashcardData.tags?.sort() || []);
    const originalTagsString = JSON.stringify(originalFlashcard.tags?.sort() || []);
    if (currentTagsString !== originalTagsString) {
       formData.append("tags", JSON.stringify(updatedFlashcardData.tags || []));
       hasChanges = true;
    }
    if (hasChanges) {
      mutation.mutate(formData);
    } else {
      alert("Nenhuma alteração foi feita.");
    }
  };

  const theme = useTheme();

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <Header />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="75vh"
        sx={{
          // Removido o background para deixar o fundo sem cor
          py: { xs: 2, md: 4 },
        }}
      >
        <Card sx={{ maxWidth: 600, width: '100%', boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Editar Flashcard
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" mb={2}>
              Altere os campos desejados e salve as modificações do seu flashcard.
            </Typography>
            {isLoading ? (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" my={3}>
                <CircularProgress color="primary" />
                <Typography color="text.secondary" mt={2}>Carregando flashcard...</Typography>
              </Box>
            ) : isError ? (
              <Typography color="error" align="center">Erro ao carregar o flashcard. Tente novamente.</Typography>
            ) : !flashcard ? (
              <Typography color="text.secondary" align="center">Flashcard não encontrado.</Typography>
            ) : (
              <>
                <FlashcardForm
                  flashcard={flashcard}
                  onSubmit={handleSubmit}
                  isEditing={true}
                />
                <Box display="flex" justifyContent="flex-start" mt={3}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => router.push("/flashcards")}
                  >
                    Voltar
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </>
  );
};

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <EditFlashcardPage />
    </QueryClientProvider>
  );
}
