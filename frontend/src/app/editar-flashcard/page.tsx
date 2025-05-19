"use client";
import { useState, useEffect } from "react";
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
      // Sempre envia o formulário, pois o FormData já contém todas as mudanças
      await mutation.mutate(formData);
    } catch (error) {
      console.error("Erro ao processar o formulário:", error);
      alert("Erro ao processar o formulário. Tente novamente.");
    }
  };

  const theme = useTheme();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="py-8 px-6 md:px-24">
        <h1 className="text-3xl font-bold text-center mb-4">Editar Flashcard</h1>
        <p className="text-center text-gray-600 mb-8">Faça alterações nos campos abaixo para atualizar seu flashcard.</p>
        {isLoading ? (
          <div className="flex justify-center mt-4">
            <CircularProgress />
          </div>
        ) : isError ? (
          <p className="text-center text-red-500">Erro ao carregar o flashcard. Tente novamente.</p>
        ) : !flashcard ? (
          <p className="text-center text-gray-600">Flashcard não encontrado.</p>
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
      </div>
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
