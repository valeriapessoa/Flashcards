"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, QueryClient, QueryClientProvider } from "react-query";
import { Flashcard } from "../../types";
import { fetchFlashcard, updateFlashcard } from "../../lib/api";
import FlashcardForm from "../../components/FlashcardForm";
import { ClipLoader } from "react-spinners";
import { useSession } from "next-auth/react";
import AccessDeniedMessage from "../../components/AccessDeniedMessage";
import AuthGuard from "@/components/AuthGuard";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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

  if (!session) {
    return <AccessDeniedMessage />;
  }

  return (
    <>
      <Header />
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
              <FlashcardForm
                flashcard={flashcard}
                onSubmit={handleSubmit}
                isEditing={true}
              />
              <div className="flex justify-start mt-4">
                <button
                  type="button"
                  onClick={() => router.push("/flashcards")}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Voltar
                </button>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthGuard>
      <EditFlashcardPage />
    </AuthGuard>
  </QueryClientProvider>
);

export default App;
