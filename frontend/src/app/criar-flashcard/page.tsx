"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FlashcardForm from "../../components/FlashcardForm";
import AccessDeniedMessage from "../../components/AccessDeniedMessage";
import axios from "axios";

const CreateFlashcard: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) {
    return <AccessDeniedMessage />;
  }

  const handleSubmit = async (data: Partial<Flashcard>, file: File | null) => {
    try {
      if (!session?.user?.id) {
        alert("Usuário não autenticado.");
        return;
      }
      console.log("Dados do formulário:", data);
      const formData = new FormData();
      formData.append("title", data.title || "");
      formData.append("description", data.description || "");
      formData.append("tags", JSON.stringify(data.tags || []));
      formData.append("userId", session.user.id);
      if (file) {
        formData.append("image", file); // Certifica-se de anexar o arquivo corretamente
      }

      await axios.post("http://localhost:5000/api/flashcards/create", formData, {
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

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <section className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Criar Flashcard</h1>
        <FlashcardForm onSubmit={handleSubmit} />
      </section>
    </main>
  );
};

export default CreateFlashcard;
