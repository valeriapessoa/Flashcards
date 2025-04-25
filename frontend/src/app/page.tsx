"use client";

import { Button, Typography, Card, CardContent, Grid, Box, Tooltip, Divider, Avatar, Fade } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DevicesIcon from '@mui/icons-material/Devices';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [flashcardCount, setFlashcardCount] = useState<number | null>(null);
  const [pendingReviews, setPendingReviews] = useState<number | null>(null);

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else {
      setFlashcardCount(24); // Exemplo
      setPendingReviews(5); // Exemplo
    }
  }, [session, router]);

  if (!session || !session.user) {
    return null;
  }

  return (
    <>
      <Header />
      {/* HERO SECTION */}
      <Box sx={{
        width: '100%',
        bgcolor: 'linear-gradient(135deg, #e3f2fd 60%, #fff 100%)',
        pt: { xs: 6, md: 10 },
        pb: { xs: 4, md: 8 },
        minHeight: { xs: 250, md: 320 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', right: 0, top: 0, opacity: 0.1, zIndex: 0 }}>
          <Image src="/flashcards.webp" alt="Flashcards Hero" width={320} height={220} style={{ objectFit: 'contain' }} />
        </Box>
        <Box sx={{ zIndex: 1, textAlign: 'center', maxWidth: 650 }}>
          <Typography variant="h3" fontWeight="bold" color="primary.main" gutterBottom>
            Torne seu aprendizado mais inteligente
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={2}>
            Organize, memorize e revise com o Flashcards Inteligentes
          </Typography>
          <Button
            component={Link}
            href="/estudar"
            variant="contained"
            color="success"
            size="large"
            sx={{ mt: 2, px: 6, py: 1.5, fontWeight: 600, fontSize: 20, boxShadow: 3, borderRadius: 3 }}
          >
            Comece a Estudar
          </Button>
        </Box>
      </Box>

      {/* RESUMO DO USUÁRIO */}
      <Box mt={-6} mb={4} width="100%" maxWidth={900} mx="auto" px={2}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={4} sx={{ borderRadius: 4, textAlign: 'center', py: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                <SchoolIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6">Seus Flashcards</Typography>
              <Typography variant="h4" color="primary" fontWeight="bold">{flashcardCount ?? '-'}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={4} sx={{ borderRadius: 4, textAlign: 'center', py: 3 }}>
              <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                <TimelineIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6">Revisões Pendentes</Typography>
              <Typography variant="h4" color="success.main" fontWeight="bold">{pendingReviews ?? '-'}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={4} sx={{ borderRadius: 4, textAlign: 'center', py: 3 }}>
              <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56, mx: 'auto', mb: 1 }}>
                <AutoAwesomeIcon fontSize="large" />
              </Avatar>
              <Typography variant="h6">Revisão Inteligente</Typography>
              <Typography variant="body1" color="text.secondary">Foque no que mais precisa</Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* BENEFÍCIOS */}
      <Box mb={4} width="100%" maxWidth={900} mx="auto" px={2}>
        <Typography variant="h5" fontWeight="bold" color="primary.main" align="center" mb={2}>
          Por que usar o Flashcards Inteligentes?
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ borderRadius: 4, textAlign: 'center', py: 3 }}>
              <EmojiObjectsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">Memorização Eficiente</Typography>
              <Typography variant="body2" color="text.secondary">Otimize seu tempo focando nos conteúdos que mais precisa revisar.</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ borderRadius: 4, textAlign: 'center', py: 3 }}>
              <DevicesIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">Acesse de Qualquer Lugar</Typography>
              <Typography variant="body2" color="text.secondary">Estude no computador, tablet ou celular, onde quiser.</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={2} sx={{ borderRadius: 4, textAlign: 'center', py: 3 }}>
              <FlashOnIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">Revisão Inteligente</Typography>
              <Typography variant="body2" color="text.secondary">O sistema prioriza os flashcards que você mais erra.</Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* AÇÕES PRINCIPAIS */}
      <Box mb={4} width="100%" maxWidth={700} mx="auto" px={2}>
        <Card elevation={3} sx={{ borderRadius: 4, p: 3, bgcolor: '#fff' }}>
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={4}>
              <Tooltip title="Crie novos flashcards para estudar" arrow>
                <Link href="/criar-flashcard">
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{ height: 56, textTransform: "none", fontWeight: 600, fontSize: 18, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.04)' } }}
                  >
                    ✏️ Criar
                  </Button>
                </Link>
              </Tooltip>
            </Grid>
            <Grid item xs={12} md={4}>
              <Tooltip title="Veja e edite seus flashcards" arrow>
                <Link href="/flashcards">
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="large"
                    fullWidth
                    sx={{ height: 56, textTransform: "none", fontWeight: 600, fontSize: 18, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.04)' } }}
                  >
                    📂 Ver
                  </Button>
                </Link>
              </Tooltip>
            </Grid>
            <Grid item xs={12} md={4}>
              <Tooltip title="Estude seus flashcards de forma inteligente" arrow>
                <Link href="/estudar">
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    fullWidth
                    sx={{ height: 56, textTransform: "none", fontWeight: 600, fontSize: 18, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.04)' } }}
                  >
                    📖 Estudar
                  </Button>
                </Link>
              </Tooltip>
            </Grid>
          </Grid>
          <Box mt={3}>
            <Typography variant="body2" color="text.secondary" align="center">
              <b>Dica:</b> Use o modo de revisão inteligente para focar nos flashcards que você mais erra!
            </Typography>
          </Box>
        </Card>
      </Box>

      {/* COMO FUNCIONA */}
      <Box mb={6} width="100%" maxWidth={900} mx="auto" px={2}>
        <Card elevation={0} sx={{ borderRadius: 4, p: 3, bgcolor: '#e3f2fd' }}>
          <Typography variant="h5" fontWeight="bold" color="primary.main" align="center" mb={2}>
            Como funciona?
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1 }}>
                  <EmojiObjectsIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">Crie seus flashcards</Typography>
                <Typography variant="body2" color="text.secondary">Adicione perguntas e respostas dos conteúdos que deseja estudar.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Avatar sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1 }}>
                  <FlashOnIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">Estude de forma inteligente</Typography>
                <Typography variant="body2" color="text.secondary">O sistema prioriza os cards que você mais erra.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Avatar sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1 }}>
                  <DevicesIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">Revise quando quiser</Typography>
                <Typography variant="body2" color="text.secondary">Acesse seus flashcards de qualquer dispositivo, a qualquer hora.</Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box>
      <Footer />
    </>
  );
}
