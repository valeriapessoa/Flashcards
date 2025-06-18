"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, QueryClient, QueryClientProvider } from "react-query";
import { Flashcard } from "../../types";
import { fetchFlashcard, updateFlashcard } from "../../lib/api";
import FlashcardForm from "../../components/FlashcardForm";
import { useSession, getSession } from "next-auth/react";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Box, Typography, Button, CircularProgress, Container } from '@mui/material';

const queryClient = new QueryClient();

const EditFlashcardPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const id = searchParams.get("id");

  const [flashcard, setFlashcard] = useState<Flashcard | null>(null);
  const [originalFlashcard, setOriginalFlashcard] = useState<Flashcard | null>(null);

  // useQuery sempre chamado, só habilita se houver id e sessão
  const { isLoading, isError } = useQuery(
    ["flashcard", id],
    async () => {
      // Garante que temos uma sessão antes de fazer a requisição
      const currentSession = await getSession();
      if (!currentSession) {
        router.push("/login");
        throw new Error("Não autenticado");
      }
      return fetchFlashcard(id as string);
    },
    {
      enabled: !!id,
      onSuccess: (data) => {
        setFlashcard(data);
        setOriginalFlashcard(data);
      },
      retry: 1,
    }
  );

  const mutation = useMutation(
    async (formData: FormData) => {
      try {
        const response = await updateFlashcard(id as string, formData);
        console.log("Resposta da API:", response);
        return response;
      } catch (error) {
        console.error("Erro ao atualizar o flashcard:", error);
        throw error;
      }
    },
    {
      onSuccess: (data) => {
        console.log("Flashcard atualizado com sucesso:", data);
        queryClient.invalidateQueries({ queryKey: ["flashcards"] });
        queryClient.invalidateQueries({ queryKey: ["flashcard", id] });
        router.push("/flashcards");
      },
      onError: (error) => {
        if (error instanceof Error) {
          alert(error.message || "Erro ao atualizar o flashcard. Tente novamente.");
        } else {
          alert("Erro ao atualizar o flashcard. Tente novamente.");
        }
      },
    }
  );

  const handleSubmit = async (formData: FormData) => {
    if (!originalFlashcard) return;

    try {
      await mutation.mutate(formData);
    } catch (error) {
      console.error("Erro ao processar o formulário:", error);
      alert("Erro ao processar o formulário. Tente novamente.");
    }
  };


  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container 
        component="main" 
        maxWidth={false}
        disableGutters
        sx={{ 
          py: { xs: 4, sm: 6, md: 8 }, 
          px: { xs: 1.5, sm: 3, md: 6, lg: 8 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1600px',
          mx: 'auto',
          overflowX: 'hidden'
        }}
      >
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
            px: 1
          }}
        >
          Editar Flashcard
        </Typography>
        <Typography 
          variant="subtitle1" 
          align="center" 
          color="text.secondary"
          sx={{ 
            mb: { xs: 4, sm: 6, md: 8 },
            maxWidth: '800px',
            mx: 'auto',
            px: { xs: 1, sm: 2 },
            fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '1rem' },
            lineHeight: { xs: 1.4, sm: 1.5 }
          }}
        >
          Faça alterações nos campos abaixo para atualizar seu flashcard.
        </Typography>
        <Box sx={{ width: '100%', maxWidth: '1400px', px: { xs: 0, sm: 2 } }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Typography align="center" color="error" sx={{ mt: 4 }}>
              Erro ao carregar o flashcard. Tente novamente.
            </Typography>
          ) : !flashcard ? (
            <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
              Flashcard não encontrado.
            </Typography>
          ) : (
            <>
              <FlashcardForm
                flashcard={flashcard}
                onSubmit={handleSubmit}
                isEditing={true}
              />
              <div className="mt-4">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => router.push("/flashcards")}
                >
                  Voltar
                </Button>
              </div>
            </>
          )}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  // Efeito para redirecionar para login quando não autenticado
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return null;
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <EditFlashcardPage />
    </QueryClientProvider>
  );
}
