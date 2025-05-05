"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FlashcardForm from "../../components/FlashcardForm";
import axios from "axios";
import { Flashcard } from "../../types";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CreateFlashcard: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (formData: FormData) => {
    try {
      if (!session?.user?.id) {
        alert("Usuário não autenticado.");
        router.push("/login");
        return;
      }

      // Adiciona o userId ao formData
      formData.append("userId", session.user.id);

      // Usa a variável de ambiente para a base URL da API
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
      await axios.post(`${apiBaseUrl}/api/flashcards/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      router.push("/flashcards");
    } catch (error) {
      console.error("Erro ao criar o flashcard:", error);
      alert("Erro ao criar o flashcard. Tente novamente.");
    }
  };

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <Header />
      <div className="py-8 px-2 md:px-8">
        <h1 className="text-3xl font-bold text-center mb-4">Criar Flashcard</h1>
        <p className="text-center text-gray-600 mb-8">Preencha os campos abaixo para adicionar um novo flashcard à sua coleção.</p>
        <FlashcardForm onSubmit={handleSubmit} />
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

  return <CreateFlashcard />;
}
