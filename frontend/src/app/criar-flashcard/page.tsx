"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FlashcardForm from "../../components/FlashcardForm";
import AccessDeniedMessage from "../../components/AccessDeniedMessage";
import axios from "axios";
import { Flashcard } from "../../types";
import AuthGuard from "@/components/AuthGuard";
import PageNavigation from '../../components/PageNavigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Box, Typography, Card, CardContent, useTheme } from '@mui/material';

const CreateFlashcard: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const theme = useTheme();

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

  if (!session) {
    return <AccessDeniedMessage />;
  }

  return (
    <>
      <Header />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="75vh"
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.default} 100%)`,
          py: { xs: 2, md: 4 },
        }}
      >
        <Card sx={{ maxWidth: 600, width: '100%', boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <PageNavigation />
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Criar Flashcard
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" mb={2}>
              Preencha os campos abaixo para adicionar um novo flashcard à sua coleção.
            </Typography>
            <FlashcardForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </>
  );
};

export default function Page() {
  return (
    <AuthGuard>
      <CreateFlashcard />
    </AuthGuard>
  );
}
