"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "react-query";
import { Flashcard } from "../../types";
import { fetchFlashcard, updateFlashcard } from "../../lib/api";
import FlashcardForm from "../../components/FlashcardForm";
import { QueryClient, QueryClientProvider } from "react-query";
import { ClipLoader } from "react-spinners";

const queryClient = new QueryClient();

const EditFlashcardPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [flashcard, setFlashcard] = useState<Flashcard | null>(null);
  const { data, isLoading, isError } = useQuery(
    ["flashcard", id],
    () => fetchFlashcard(id as string),
    {
      enabled: !!id,
      onSuccess: (data) => setFlashcard(data),
    }
  );

  const mutation = useMutation(updateFlashcard, {
    onSuccess: () => {
      router.push("/flashcards");
    },
  });

  const handleSubmit = (updatedFlashcard: Flashcard) => {
    mutation.mutate(updatedFlashcard);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <section className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Editar Flashcard</h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <ClipLoader size={40} color="#4A90E2" />
            <p className="text-gray-600 mt-2">Carregando flashcard...</p>
          </div>
        ) : isError ? (
          <p className="text-red-600">Erro ao carregar o flashcard. Tente novamente.</p>
        ) : !flashcard ? (
          <p className="text-gray-600">Flashcard não encontrado.</p>
        ) : (
          <>
            <FlashcardForm flashcard={flashcard} onSubmit={handleSubmit} />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => router.push("/flashcards")}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Voltar
              </button>
              <button
                onClick={() => handleSubmit(flashcard)}
                className={`px-4 py-2 rounded-lg ${
                  mutation.isLoading
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <EditFlashcardPage />
  </QueryClientProvider>
);

export default App;
