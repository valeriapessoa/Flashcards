"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query"; // Corrigido para @tanstack/react-query
// Removido axios
import StudyMode from "@/components/StudyMode";
import { Flashcard } from "@/types"; // Mantido
import { fetchFlashcards } from "@/lib/api"; // Importado fetchFlashcards de lib/api
import { CircularProgress, Button, Typography, Alert } from "@mui/material"; // Adicionado Typography e Alert
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Removida a função fetchFlashcards local, usaremos a importada de lib/api

const StudyPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  // Usar a sintaxe de objeto para useQuery (v5+) e a função importada
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 p-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 animate-fade-in">
          📚 Modo de Estudo
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
          <span role="img" aria-label="aviso">⚠️</span> Você precisa estar logado para acessar esta página.
        </div>
      </div>
    );
  }

  const { data: flashcards = [], isLoading, isError, error, refetch } = useQuery<Flashcard[], Error>({
    queryKey: ["flashcards"],
    queryFn: fetchFlashcards, // Usa a função autenticada de lib/api
    // enabled: status === 'authenticated' // Descomentar se usar useSession aqui
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 animate-fade-in">
        📚 Modo de Estudo
      </h1>

      {isLoading && (
        <div className="flex flex-col items-center gap-4 animate-fade-in" aria-live="polite">
          <CircularProgress />
          <p className="text-gray-600">Carregando flashcards, por favor aguarde...</p>
        </div>
      )}

      {/* Melhor tratamento de erro usando isError */}
      {isError && (
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        }>
          Erro ao carregar flashcards: {(error as Error)?.message || 'Erro desconhecido'}
        </Alert>
      )}

      {flashcards?.length === 0 && (
        <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg animate-fade-in">
          <p className="text-gray-700 text-lg">⚠️ Nenhum flashcard encontrado.</p>
          <p className="text-gray-500 mb-4">Crie um novo flashcard para começar seus estudos.</p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/criar-flashcard")} // Corrigido o link para criar
          >
            ➕ Criar Flashcard
          </Button>
        </div>
      )}

      {/* Simplificado: se não está carregando, não há erro e há flashcards */}
      {!isLoading && !isError && flashcards.length > 0 && (
        <div className="w-full max-w-4xl">
          <StudyMode flashcards={flashcards} /> {/* Não precisa mais de ?? [] */}
        </div>
      )}
    </div>
  );
};

export default StudyPage;
