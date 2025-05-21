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
          pt: { xs: 6, md: 10 },
          pb: { xs: 6, md: 10 },
          minHeight: { xs: 300, md: 350 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Grid container spacing={2} alignItems="center" sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: 2 }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ 
              textAlign: 'left',
              maxWidth: '100%',
              width: '100%',
              padding: '0 1rem',
              margin: '0 auto'
            }}>
              <Typography variant="h2" fontWeight="bold" color="primary.main" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, lineHeight: 1.2 }}>
                Torne seu aprendizado mais eficiente
              </Typography>
              <Typography variant="h5" color="text.secondary" mb={4} sx={{ mt: 2 }}>
                Organize, memorize e revise com Flashcards modernos
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '400px' }}>
              <Image 
                src="/images/mascote.png" 
                alt="Bem-vindo ao Flashcard" 
                width={350} 
                height={220} 
                style={{ objectFit: 'contain' }} 
                priority 
              />
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            component={Link}
            href="/estudar"
            variant="contained"
            color="success"
            size="large"
            sx={{ px: 6, py: 1.5, fontWeight: 600, fontSize: 20, boxShadow: 3, borderRadius: 3 }}
          >
            Comece a Estudar
          </Button>
        </Box>
      </Box>

      {/* COMO FUNCIONA */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8, px: 2 }}>
        <Typography variant="h4" fontWeight="bold" color="primary.main" align="center" mb={6}>
          Como Funciona
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Grid item xs={12} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 4, 
                bgcolor: 'background.paper',
                boxShadow: 3,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <SchoolIcon color="primary" sx={{ fontSize: 70, mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" mb={2}>
                1. Registre-se
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={2}>
                Crie sua conta e comece a usar o Flashcards Inteligentes.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 4, 
                bgcolor: 'background.paper',
                boxShadow: 3,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <FlashOnIcon color="primary" sx={{ fontSize: 70, mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" mb={2}>
                2. Crie Flashcards
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={2}>
                Adicione perguntas e respostas em seus próprios flashcards personalizados.
                Organize-os em categorias para facilitar seu estudo.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 4, 
                bgcolor: 'background.paper',
                boxShadow: 3,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <QuizIcon color="primary" sx={{ fontSize: 70, mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" mb={2}>
                3. Estude Interativamente
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={2}>
                Revise seus flashcards em modo de estudo interativo.
                Responda perguntas e obtenha feedback imediato.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                p: 4, 
                bgcolor: 'background.paper',
                boxShadow: 3,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <TimelineIcon color="primary" sx={{ fontSize: 70, mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" mb={2}>
                4. Revisão Inteligente
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={2}>
                O sistema identifica seus pontos fracos e prioriza a revisão dos conteúdos
                que você mais precisa revisar.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* BENEFÍCIOS */}
      <Box mb={8} width="100%" px={2}>
        <Typography variant="h5" fontWeight="bold" color="primary.main" align="center" mb={3}>
          Por que usar o Flashcards Inteligentes?
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
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
              <Typography variant="subtitle1" fontWeight="bold">Revisão Adaptativa</Typography>
              <Typography variant="body2" color="text.secondary">O sistema se adapta ao seu ritmo de aprendizado, focando nos conteúdos que mais precisa.</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* BENEFÍCIOS */}
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
                        src="/images/testimonials/img1.jpg"
                        sx={{ 
                          width: 60, 
                          height: 60,
                          bgcolor: 'transparent'
                        }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Giovana Almeida
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
                        src="/images/testimonials/img2.jpg"
                        sx={{ 
                          width: 60, 
                          height: 60,
                          bgcolor: 'transparent'
                        }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Camila Ferreira
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
                        src="/images/testimonials/img3.jpg"
                        sx={{ 
                          width: 60, 
                          height: 60,
                          bgcolor: 'transparent'
                        }}
                      />
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Liam Fernandes
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
