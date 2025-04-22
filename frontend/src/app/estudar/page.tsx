"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query"; // Corrigido para @tanstack/react-query
// Removido axios
import StudyMode from "@/components/StudyMode";
import { Flashcard } from "@/types"; // Mantido
import { fetchFlashcards } from "@/lib/api"; // Importado fetchFlashcards de lib/api
import { CircularProgress, Button, Typography, Alert, Box, Card, CardContent, useTheme } from "@mui/material"; // Adicionado Typography e Alert
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AccessDeniedMessage from "../../components/AccessDeniedMessage";
import AuthGuard from "@/components/AuthGuard";
import PageNavigation from '../../components/PageNavigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Removida a função fetchFlashcards local, usaremos a importada de lib/api

const StudyPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const theme = useTheme();
  // Chame useQuery sempre, mas só habilite quando autenticado
  const {
    data: flashcards = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Flashcard[], Error>({
    queryKey: ["flashcards"],
    queryFn: fetchFlashcards,
    enabled: !!session, // só executa a query se autenticado
  });

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
        <Card sx={{ maxWidth: 700, width: '100%', boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <PageNavigation />
            <Typography variant="h4" component="h1" gutterBottom align="center">
              📚 Modo de Estudo
            </Typography>
            {isLoading && (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" my={3} aria-live="polite">
                <CircularProgress />
                <Typography color="text.secondary" mt={2}>Carregando flashcards, por favor aguarde...</Typography>
              </Box>
            )}
            {isError && (
              <Alert severity="error" action={
                <Button color="inherit" size="small" onClick={() => refetch()}>
                  Tentar novamente
                </Button>
              }>
                Erro ao carregar flashcards: {(error as Error)?.message || 'Erro desconhecido'}
              </Alert>
            )}
            {flashcards?.length === 0 && !isLoading && !isError && (
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" bgcolor="background.paper" p={4} borderRadius={2} boxShadow={2}>
                <Typography color="text.secondary" fontSize={18} mb={1}>⚠️ Nenhum flashcard encontrado.</Typography>
                <Typography color="text.secondary" mb={2}>Crie um novo flashcard para começar seus estudos.</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => router.push("/criar-flashcard")}
                >
                  ➕ Criar Flashcard
                </Button>
              </Box>
            )}
            {!isLoading && !isError && flashcards.length > 0 && (
              <Box width="100%" maxWidth={600} mx="auto">
                <StudyMode flashcards={flashcards} />
              </Box>
            )}
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
      <StudyPage />
    </AuthGuard>
  );
}
