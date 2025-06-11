"use client";

import { Button, Typography, Card, CardContent, Grid, Box, Tooltip, Divider, Avatar, Fade, Rating } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TestimonialsSection from "../components/TestimonialsSection";
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
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HowToRegIcon from '@mui/icons-material/HowToReg';
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
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'linear-gradient(135deg, #e3f2fd 60%, #fff 100%)',
          pt: 0,
          pb: { xs: 4, md: 6 },
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Grid 
          container 
          spacing={6} 
          alignItems="center" 
          justifyContent="center"
          sx={{ 
            maxWidth: '1400px', 
            width: '100%', 
            mx: 'auto', 
            px: { xs: 4, md: 6 },
            py: { xs: 4, md: 8 }
          }}
        >
          <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'flex-start', pt: { xs: 2, md: 4 } }}>
            <Box sx={{ 
              maxWidth: '600px',
              mx: 'auto',
              textAlign: { xs: 'center', md: 'left' },
              px: { xs: 0, md: 4 },
              mt: { xs: 2, md: 0 }
            }}>
              <Typography 
                variant="h1" 
                component="h1"
                sx={{ 
                  fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 3,
                  color: 'primary.main'
                }}
              >
                Torne seu aprendizado mais eficiente
              </Typography>
              <Box
                sx={{
                  width: { xs: 80, md: 100 },
                  height: { xs: 3, md: 4 },
                  bgcolor: '#ff7043',
                  mb: 4,
                  mx: { xs: 'auto', md: 0 }
                }}
              />
              <Typography 
                variant="h4" 
                component="h2"
                sx={{ 
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  fontWeight: 400,
                  color: 'text.secondary',
                  mb: 3,
                  lineHeight: 1.4
                }}
              >
                Organize, memorize e revise com Flashcards modernos
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, justifyContent: { xs: 'center', md: 'flex-start' }, mt: 4 }}>
                <Button
                  component={Link}
                  href="/estudar"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    textTransform: 'none'
                  }}
                >
                  Começar Agora
                </Button>
                <Button
                  component="a"
                  href="#beneficios"
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    textTransform: 'none'
                  }}
                >
                  Saiba Mais
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={6} sx={{ position: 'relative', height: '100%' }}>
            <Box sx={{ 
              width: '100%', 
              height: '100%',
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <Image 
                src="/images/mascote33.png" 
                alt="Bem-vindo ao Flashcard" 
                width={800}
                height={800}
                priority
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))'
                }} 
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* COMO FUNCIONA */}
      <Box sx={{ bgcolor: '#f8f9fa', py: 8, px: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2"
            color="primary"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem', lg: '2.5rem' },
              letterSpacing: '0.05em',
              mb: 2,
              fontWeight: 700,
              textTransform: 'capitalize'
            }}
          >
            Como Funciona
          </Typography>
          <Box
            sx={{
              width: 80,
              height: 4,
              bgcolor: '#ff7043',
              mx: 'auto',
              mb: 4
            }}
          />
        </Box>
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
              <HowToRegIcon color="primary" sx={{ fontSize: 70, mb: 2 }} />
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
      <Box id="beneficios" sx={{ py: 8, px: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2"
            color="primary"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem', lg: '2.5rem' },
              letterSpacing: '0.05em',
              mb: 2,
              fontWeight: 700,
              textTransform: 'capitalize'
            }}
          >
            Benefícios
          </Typography>
          <Box
            sx={{
              width: 80,
              height: 4,
              bgcolor: '#ff0000',
              mx: 'auto',
              mb: 4
            }}
          />
        </Box>
        <Typography variant="h4" component="h3" color="primary.main" align="center" mb={6} sx={{ fontWeight: 600, fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
          Por que usar o Flashcards Inteligentes?
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ borderRadius: 4, textAlign: 'center', py: 4, bgcolor: 'transparent', height: '100%' }}>
              <EmojiObjectsIcon color="primary" sx={{ fontSize: 48, mb: 3 }} />
              <Typography variant="h6" component="h4" fontWeight={600} gutterBottom>Memorização Eficiente</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Otimize seu tempo focando nos conteúdos que mais precisa revisar.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ borderRadius: 4, textAlign: 'center', py: 4, bgcolor: 'transparent', height: '100%' }}>
              <DevicesIcon color="secondary" sx={{ fontSize: 48, mb: 3 }} />
              <Typography variant="h6" component="h4" fontWeight={600} gutterBottom>Acesse de Qualquer Lugar</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Estude no computador, tablet ou celular, mesmo offline.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ borderRadius: 4, textAlign: 'center', py: 4, bgcolor: 'transparent', height: '100%' }}>
              <FlashOnIcon color="warning" sx={{ fontSize: 48, mb: 3 }} />
              <Typography variant="h6" component="h4" fontWeight={600} gutterBottom>Revisão Inteligente</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Sistema que prioriza os flashcards que você mais erra para melhorar a retenção.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ borderRadius: 4, textAlign: 'center', py: 4, bgcolor: 'transparent', height: '100%' }}>
              <AddCircleOutlineIcon color="success" sx={{ fontSize: 48, mb: 3 }} />
              <Typography variant="h6" component="h4" fontWeight={600} gutterBottom>Crie Seus Próprios Cards</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Personalize seus estudos criando flashcards com o conteúdo que você precisa aprender.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ borderRadius: 4, textAlign: 'center', py: 4, bgcolor: 'transparent', height: '100%' }}>
              <AutoAwesomeIcon color="warning" sx={{ fontSize: 48, mb: 3 }} />
              <Typography variant="h6" component="h4" fontWeight={600} gutterBottom>Interface Intuitiva</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Design limpo e fácil de usar, para que você possa focar apenas nos estudos.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ borderRadius: 4, textAlign: 'center', py: 4, bgcolor: 'transparent', height: '100%' }}>
              <SchoolIcon color="info" sx={{ fontSize: 48, mb: 3 }} />
              <Typography variant="h6" component="h4" fontWeight={600} gutterBottom>Aprendizado Eficaz</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Método comprovado para melhorar sua retenção de conteúdo de forma eficiente.</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* SEÇÃO DE IMAGEM COM TÍTULO */}
      <Box sx={{ 
        py: 10, 
        px: 2, 
        background: 'linear-gradient(135deg, rgb(255 235 235) 0%, rgba(255, 248, 240, 0.9) 100%)',
        position: 'relative',
        width: '100%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '5%',
          right: '5%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 152, 0, 0.3), transparent)'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: '5%',
          right: '5%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 152, 0, 0.3), transparent)'
        }
      }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center" sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 700,
                height: { xs: 300, md: 500 },
                mx: 'auto',
                '& img': {
                  objectFit: 'contain !important',
                }
              }}
            >
              <Image
                src="/images/estudar.png"
                alt="Estudar com Flashcards"
                layout="fill"
                priority
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography 
              variant="h3" 
              component="h2"
              sx={{
                fontSize: { xs: '2.2rem', md: '2.8rem' },
                fontWeight: 800,
                mb: 3,
                color: 'primary.main',
                lineHeight: 1.1
              }}
            >
              Transforme sua forma de estudar
            </Typography>
            <Typography 
              variant="h5" 
              component="p"
              sx={{
                fontSize: { xs: '1.3rem', md: '1.7rem' },
                color: 'text.secondary',
                lineHeight: 1.4,
                maxWidth: '90%'
              }}
            >
              Aprenda de forma mais eficiente e divertida com nossa plataforma de flashcards interativos
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <TestimonialsSection />
      <Footer />
    </>
  );
}
