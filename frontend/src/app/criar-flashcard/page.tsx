"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import FlashcardForm from "../../components/FlashcardForm";
import axios from "axios";
import { Flashcard } from "../../types";
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Box, Container, Typography } from '@mui/material';

const CreateFlashcard: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

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
      // Invalida as queries relacionadas aos flashcards para atualizar os dados
      queryClient.invalidateQueries({ queryKey: ['studySessionFlashcards'] });
      router.push("/flashcards");
    } catch (error) {
      console.error("Erro ao criar o flashcard:", error);
      alert("Erro ao criar o flashcard. Tente novamente.");
    }
  };

  // Efeito para redirecionar para login quando não autenticado
  React.useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container 
        component="main" 
        maxWidth={false}
        disableGutters
        sx={{ 
          py: 8, 
          px: { xs: 2, sm: 4, md: 6, lg: 8 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1600px',
          mx: 'auto'
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            mb: 2
          }}
        >
          Criar Flashcard
        </Typography>
        <Typography 
          variant="subtitle1" 
          align="center" 
          color="text.secondary"
          sx={{ 
            mb: 8,
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          Preencha os campos abaixo para adicionar um novo flashcard à sua coleção.
        </Typography>
        <Box sx={{ width: '100%', maxWidth: '1400px', px: { xs: 0, sm: 2 } }}>
          <FlashcardForm 
            onSubmit={handleSubmit} 
            onCreated={() => {
              queryClient.invalidateQueries({ queryKey: ['studySessionFlashcards'] });
            }} 
          />
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default function Page() {
  const { status } = useSession();
  const router = useRouter();

  // Efeito para redirecionar para login quando não autenticado
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return null;
  if (status === "unauthenticated") {
    return null;
  }

  return <CreateFlashcard />;
}
