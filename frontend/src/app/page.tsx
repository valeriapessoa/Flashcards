"use client";

import { Button, Typography, Card, CardContent, Grid, Box, Tooltip, Divider, Avatar, Fade, Rating } from "@mui/material";
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
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
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
          pt: { xs: 8, md: 12 },
          pb: { xs: 6, md: 10 },
          minHeight: { xs: 300, md: 350 },
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
          <Typography variant="h6" color="text.secondary" mb={3}>
            Organize, memorize e revise com o Flashcards Inteligentes
          </Typography>
          <Button
            component={Link}
            href="/estudar"
            variant="contained"
            color="success"
            size="large"
            sx={{ mt: 3, px: 6, py: 1.5, fontWeight: 600, fontSize: 20, boxShadow: 3, borderRadius: 3 }}
          >
            Comece a Estudar
          </Button>
        </Box>
      </Box>

      {/* BENEFÍCIOS */}
      <Box mb={8} width="100%" px={2}>
        <Typography variant="h5" fontWeight="bold" color="primary.main" align="center" mb={3}>
          Por que usar o Flashcards Inteligentes?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Box sx={{ borderRadius: 4, textAlign: 'center', py: 4, bgcolor: 'transparent' }}>
              <EmojiObjectsIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold">Memorização Eficiente</Typography>
              <Typography variant="body2" color="text.secondary">Otimize seu tempo focando nos conteúdos que mais precisa revisar.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ borderRadius: 4, textAlign: 'center', py: 4, bgcolor: 'transparent' }}>
              <DevicesIcon color="secondary" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold">Acesse de Qualquer Lugar</Typography>
              <Typography variant="body2" color="text.secondary">Estude no computador, tablet ou celular, onde quiser.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ borderRadius: 4, textAlign: 'center', py: 4, bgcolor: 'transparent' }}>
              <FlashOnIcon color="warning" sx={{ fontSize: 40, mb: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold">Revisão Inteligente</Typography>
              <Typography variant="body2" color="text.secondary">O sistema prioriza os flashcards que você mais erra, otimizando seu tempo de estudo.</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* COMO FUNCIONA */}
      <Box mb={8} width="100%" px={2}>
        {/* DEPOIMENTOS */}
        <Box mb={8} width="100%" px={2}>
          <Typography variant="h5" fontWeight="bold" color="primary.main" align="center" mb={4}>
            Depoimentos de Usuários
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: 2,
                bgcolor: '#fff',
                boxShadow: 3
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2 
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 2 
                    }}>
                      <Avatar 
                        src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=100&q=80"
                        sx={{ 
                          width: 60, 
                          height: 60,
                          bgcolor: 'transparent'
                        }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Giovana Alves
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Estudante de Medicina
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" color="text.primary">
                      "O Flashcards Inteligentes mudou minha forma de estudar. Antes eu gastava horas revisando conteúdo que já sabia. Agora, o sistema me mostra exatamente o que preciso focar, economizando meu tempo de estudo."
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Rating 
                        value={5} 
                        readOnly 
                        precision={0.5}
                        sx={{ color: '#ffd700' }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: 2,
                bgcolor: '#fff',
                boxShadow: 3
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2 
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 2 
                    }}>
                      <Avatar 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80"
                        sx={{ 
                          width: 60, 
                          height: 60,
                          bgcolor: 'transparent'
                        }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Camila Santos
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Analista de Dados
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" color="text.primary">
                      "O sistema de flashcards inteligente me ajudou a organizar melhor meus estudos e identificar áreas que precisavam de mais atenção. Agora consigo revisar de forma mais eficiente."
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Rating 
                        value={4.5} 
                        readOnly 
                        precision={0.5}
                        sx={{ color: '#ffd700' }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ 
                height: '100%', 
                borderRadius: 2,
                bgcolor: '#fff',
                boxShadow: 3
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2 
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: 2 
                    }}>
                      <Avatar 
                        src="https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=100&q=80"
                        sx={{ 
                          width: 60, 
                          height: 60,
                          bgcolor: 'transparent'
                        }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Lucas Silva
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Desenvolvedor
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" color="text.primary">
                      "O sistema de flashcards inteligente me ajudou a organizar meus estudos de programação e melhorar minha produtividade. Agora consigo revisar conceitos complexos de forma mais eficiente."
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Rating 
                        value={5} 
                        readOnly 
                        precision={0.5}
                        sx={{ color: '#ffd700' }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          pt: 4
        }}>
          <Box sx={{ 
            display: 'flex',
            gap: 4,
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}>
              <Typography variant="h3" fontWeight="bold" color="primary.main">
                1M+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Usuários Ativos
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}>
              <Typography variant="h3" fontWeight="bold" color="primary.main">
                10M+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Flashcards Criados
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}>
              <Typography variant="h3" fontWeight="bold" color="primary.main">
                98%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Taxa de Aprovação
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ height: '100px', width: '100%' }} />

      <Footer />
    </>
  );
}
