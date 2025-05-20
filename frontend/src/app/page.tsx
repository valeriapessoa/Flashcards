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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import QuizIcon from '@mui/icons-material/Quiz';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      <Header />
      {/* HERO SECTION */}
      <Box
        sx={{
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
        }}
      >
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

      {/* BENEFÍCIOS */}
      <Box mb={4} width="100%" maxWidth={900} mx="auto" px={2}>
        <Typography variant="h5" fontWeight="bold" color="primary.main" align="center" mb={2}>
          Por que usar o Flashcards Inteligentes?
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Box sx={{ borderRadius: 4, textAlign: 'center', py: 3, bgcolor: 'transparent' }}>
              <EmojiObjectsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">Memorização Eficiente</Typography>
              <Typography variant="body2" color="text.secondary">Otimize seu tempo focando nos conteúdos que mais precisa revisar.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ borderRadius: 4, textAlign: 'center', py: 3, bgcolor: 'transparent' }}>
              <DevicesIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">Acesse de Qualquer Lugar</Typography>
              <Typography variant="body2" color="text.secondary">Estude no computador, tablet ou celular, onde quiser.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ borderRadius: 4, textAlign: 'center', py: 3, bgcolor: 'transparent' }}>
              <FlashOnIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">Revisão Inteligente</Typography>
              <Typography variant="body2" color="text.secondary">O sistema prioriza os flashcards que você mais erra, otimizando seu tempo de estudo.</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* COMO FUNCIONA */}
      <Box mb={6} width="100%" maxWidth={900} mx="auto" px={2}>
        <Box sx={{ borderRadius: 4, p: 3, bgcolor: '#e3f2fd' }}>
          <Typography variant="h5" fontWeight="bold" color="primary.main" align="center" mb={2}>
            Como funciona?
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Box sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 1, borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AddCircleOutlineIcon />
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">Crie seus flashcards</Typography>
                <Typography variant="body2" color="text.secondary">Adicione perguntas e respostas dos conteúdos que deseja estudar.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Box sx={{ bgcolor: 'secondary.main', mx: 'auto', mb: 1, borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <QuizIcon />
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">Estude de forma inteligente</Typography>
                <Typography variant="body2" color="text.secondary">O sistema prioriza os cards que você mais erra.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Box sx={{ bgcolor: 'success.main', mx: 'auto', mb: 1, borderRadius: '50%', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AccessTimeIcon />
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">Revise quando quiser</Typography>
                <Typography variant="body2" color="text.secondary">Acesse seus flashcards de qualquer dispositivo, a qualquer hora.</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Footer />
    </>
  );
}
