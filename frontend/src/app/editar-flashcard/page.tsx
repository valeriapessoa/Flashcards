"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, QueryClient, QueryClientProvider } from "react-query";
import { Flashcard } from "../../types";
import { fetchFlashcard, updateFlashcard } from "../../lib/api";
import FlashcardForm from "../../components/FlashcardForm";
import { ClipLoader } from "react-spinners";

const queryClient = new QueryClient();

const EditFlashcardPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [flashcard, setFlashcard] = useState<Flashcard | null>(null); // Estado atual do formulário
  const [originalFlashcard, setOriginalFlashcard] = useState<Flashcard | null>(null); // Estado original carregado

  const { data, isLoading, isError } = useQuery(
    ["flashcard", id],
    () => fetchFlashcard(id as string),
    {
      enabled: !!id,
      onSuccess: (data) => {
        setFlashcard(data);
        setOriginalFlashcard(data); // Guarda o estado original
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
    if (!originalFlashcard) return; // Não deve acontecer, mas garante a segurança

    const formData = new FormData();
    let hasChanges = false;

    // Compara e adiciona apenas os campos modificados
    if (updatedFlashcardData.title !== originalFlashcard.title) {
      formData.append("title", updatedFlashcardData.title || ""); // Envia string vazia se for undefined
      hasChanges = true;
    }
    if (updatedFlashcardData.description !== originalFlashcard.description) {
      formData.append("description", updatedFlashcardData.description || ""); // Envia string vazia se for undefined
      hasChanges = true;
    }
    // Adiciona a imagem se um novo arquivo foi selecionado
    if (file) {
      formData.append("image", file);
      hasChanges = true;
    }

    // Adiciona tags se forem diferentes (assumindo que 'tags' é um array de strings no seu tipo Flashcard)
    // Adapte esta lógica se a estrutura de tags for diferente
    const currentTagsString = JSON.stringify(updatedFlashcardData.tags?.sort() || []);
    const originalTagsString = JSON.stringify(originalFlashcard.tags?.sort() || []);
    if (currentTagsString !== originalTagsString) {
       // O backend espera uma string JSON para tags na atualização
       formData.append("tags", JSON.stringify(updatedFlashcardData.tags || []));
       hasChanges = true;
    }


    // Só envia a mutação se houver alterações
    if (hasChanges) {
       console.log("Enviando dados modificados:", Object.fromEntries(formData.entries()));
      mutation.mutate(formData);
    } else {
      console.log("Nenhuma alteração detectada.");
      // Opcional: Mostrar uma mensagem para o usuário que nada foi alterado
      alert("Nenhuma alteração foi feita.");
      // Ou redirecionar diretamente
      // router.push("/flashcards");
    }
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
            <FlashcardForm
              flashcard={flashcard}
              onSubmit={handleSubmit}
              isEditing={true} // Passa a prop para indicar edição
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
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <EditFlashcardPage />
  </QueryClientProvider>
);

export default App;

