"use client";

import { Button, Typography, Card, CardContent, Grid, Box, Tooltip, Divider } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  // Placeholders para progresso do usuário
  const [flashcardCount, setFlashcardCount] = useState<number | null>(null);
  const [pendingReviews, setPendingReviews] = useState<number | null>(null);

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else {
      // Aqui você pode buscar dados reais do backend futuramente
      setFlashcardCount(24); // Exemplo
      setPendingReviews(5); // Exemplo
    }
  }, [session, router]);

  if (!session || !session.user) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" bgcolor="#F6F8FC" px={2}>
      {session && (
        <Button
          variant="contained"
          color="error"
          size="large"
          onClick={() => signOut()}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            height: 40,
            minWidth: 100,
            textTransform: "none",
          }}
        >
          Sair
        </Button>
      )}
      <Box mt={8} mb={2} width="100%" maxWidth={700}>
        <Card elevation={4} sx={{ borderRadius: 4, p: 2, background: 'linear-gradient(90deg,#e3f2fd 60%,#fff 100%)' }}>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
              📚 Flashcards Inteligentes
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Bem-vindo, {session.user.name}!
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              Organize seus estudos e memorize com facilidade.
            </Typography>
            <Divider sx={{ my: 2 }} />
            {/* Cards removidos conforme solicitado */}
          </CardContent>
        </Card>
      </Box>
      <Box mt={2} mb={2} width="100%" maxWidth={700}>
        <Card elevation={2} sx={{ borderRadius: 4, p: 2, bgcolor: '#fff' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={5}>
              <Box position="relative" width="100%" height={{ xs: 180, sm: 220, md: 240 }}>
                <Image
                  src="/flashcards.webp"
                  alt="Estudando com Flashcards"
                  layout="fill"
                  style={{ objectFit: "contain", borderRadius: 12 }}
                  priority
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Tooltip title="Crie novos flashcards para estudar" arrow>
                    <Link href="/criar-flashcard" passHref legacyBehavior>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        sx={{ height: 56, textTransform: "none", fontWeight: 600 }}
                      >
                        ✏️ Criar
                      </Button>
                    </Link>
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Tooltip title="Veja e edite seus flashcards" arrow>
                    <Link href="/flashcards" passHref legacyBehavior>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        fullWidth
                        sx={{ height: 56, textTransform: "none", fontWeight: 600 }}
                      >
                        📂 Ver
                      </Button>
                    </Link>
                  </Tooltip>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Tooltip title="Estude seus flashcards de forma inteligente" arrow>
                    <Link href="/estudar" passHref legacyBehavior>
                      <Button
                        variant="contained"
                        color="success"
                        size="large"
                        fullWidth
                        sx={{ height: 56, textTransform: "none", fontWeight: 600 }}
                      >
                        📖 Estudar
                      </Button>
                    </Link>
                  </Tooltip>
                </Grid>
              </Grid>
              <Box mt={3}>
                <Typography variant="body2" color="text.secondary">
                  <b>Dica:</b> Use o modo de revisão inteligente para focar nos flashcards que você mais erra!
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>
      <Box mt={2} width="100%" maxWidth={700}>
        <Card elevation={0} sx={{ borderRadius: 4, p: 2, bgcolor: '#e3f2fd' }}>
          <Typography variant="body2" color="primary.main" align="center">
            Novato por aqui? Comece criando seus flashcards, depois acesse o modo <b>Estudar</b> ou <b>Revisão Inteligente</b> para turbinar sua memorização!
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}
