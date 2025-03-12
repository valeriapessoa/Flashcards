"use client";

import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import StudyMode from "@/components/StudyMode";
import { Flashcard } from "@/types";
import { CircularProgress } from "@mui/material";

const fetchFlashcards = async () => {
  const response = await axios.get("/api/flashcards");
  return response.data;
};

const StudyPage: React.FC = () => {
  const { data: flashcards, isLoading, error } = useQuery<Flashcard[]>(
    "flashcards",
    fetchFlashcards
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Modo de Estudo 📚</h1>

      {isLoading && (
        <div className="flex flex-col items-center gap-4" aria-live="polite">
          <CircularProgress />
          <p className="text-gray-600">Carregando flashcards...</p>
        </div>
      )}

      {!!error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
          <p>Erro ao carregar flashcards. Por favor, tente novamente.</p>
        </div>
      )}

      {flashcards && <StudyMode flashcards={flashcards} />}
    </div>
  );
};

export default StudyPage;
