"use client";

import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import StudyMode from "@/components/StudyMode";
import { Flashcard } from "@/types";
import { CircularProgress, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const fetchFlashcards = async () => {
  const response = await axios.get("http://localhost:5000/api/flashcards");
  return response.data;
};

const StudyPage: React.FC = () => {
  const router = useRouter();
  const { data: flashcards, isLoading, error, refetch } = useQuery<Flashcard[]>(
    "flashcards",
    fetchFlashcards
  );

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

      {!!error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md flex flex-col items-center gap-2 animate-fade-in">
          <p>❌ Ocorreu um erro ao carregar os flashcards.</p>
          <Button variant="contained" color="error" onClick={() => refetch()} className="mt-2">
            Tentar novamente
          </Button>
        </div>
      )}

      {flashcards?.length === 0 && (
        <div className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-lg animate-fade-in">
          <p className="text-gray-700 text-lg">⚠️ Nenhum flashcard encontrado.</p>
          <p className="text-gray-500 mb-4">Crie um novo flashcard para começar seus estudos.</p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/flashcards/new")}
          >
            ➕ Criar Flashcard
          </Button>
        </div>
      )}

      {(flashcards?.length ?? 0) > 0 && (
        <div className="w-full max-w-4xl">
          <StudyMode flashcards={flashcards ?? []} />
        </div>
      )}
    </div>
  );
};

export default StudyPage;
