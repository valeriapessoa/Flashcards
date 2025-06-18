"use client"

import { useState } from "react"
import { Box, Typography, IconButton, Avatar, Container, Rating } from "@mui/material"
import { styled } from "@mui/material/styles"
import { ChevronLeft, ChevronRight } from "@mui/icons-material"
import Image from "next/image"

const testimonials = [
  {
    id: 3,
    name: "Liam Fernandes",
    role: "Desenvolvedor",
    content:
      "O sistema de flashcards inteligente me ajudou a organizar meus estudos de programação e melhorar minha produtividade. Agora consigo revisar conceitos complexos de forma mais eficiente.",
    image: "/images/testimonials/img3.jpg",
    rating: 5,
  },
  {
    id: 1,
    name: "Giovana Almeida",
    role: "Estudante de Medicina",
    content:
      "O Flashcards Inteligentes mudou minha forma de estudar. Antes eu gastava horas revisando conteúdo que já sabia. Agora, o sistema me mostra exatamente o que preciso focar, economizando meu tempo de estudo.",
    image: "/images/testimonials/img1.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Camila Ferreira",
    role: "Analista de Dados",
    content:
      "O sistema de flashcards inteligente me ajudou a organizar melhor meus estudos e identificar áreas que precisavam de mais atenção. Agora consigo revisar de forma mais eficiente.",
    image: "/images/testimonials/img2.jpg",
    rating: 5,
  },
]

// Avatar maior sem borda
const StyledAvatar = styled(Avatar)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  "&.MuiAvatar-root": {
    width: 280,
    height: 280,
    [theme.breakpoints.down("lg")]: {
      width: 240,
      height: 240,
    },
    [theme.breakpoints.down("md")]: {
      width: 200,
      height: 200,
    },
    [theme.breakpoints.down("sm")]: {
      width: 150,
      height: 150,
    },
    [theme.breakpoints.down(400)]: {
      width: 120,
      height: 120,
    },
  },
}))

// Botões de navegação maiores e mais distantes
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[600],
  padding: 16,
  "&:hover": {
    color: theme.palette.grey[800],
    backgroundColor: "transparent",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "3.5rem",
    [theme.breakpoints.down("md")]: {
      fontSize: "2.5rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "2rem",
    },
  },
  [theme.breakpoints.down("sm")]: {
    padding: 12,
  },
  [theme.breakpoints.down(400)]: {
    padding: 8,
  },
}))

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const totalTestimonials = testimonials.length

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalTestimonials)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalTestimonials) % totalTestimonials)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <Box
      sx={{
        py: { xs: 4, sm: 5, md: 8 },
        px: { xs: 1, sm: 2 },
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={{ xs: 3, sm: 4, md: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            color="primary"
            sx={{
              fontSize: { xs: "1.75rem", md: "2.25rem", lg: "2.5rem" },
              letterSpacing: "0.05em",
              mb: 2,
              fontWeight: 700,
              textTransform: "capitalize",
            }}
          >
            Depoimentos
          </Typography>
          <Box
            sx={{
              width: { xs: 60, sm: 80, md: 100 },
              height: { xs: 3, md: 4 },
              bgcolor: "#ff7043",
              mx: "auto",
            }}
          />
        </Box>

        {/* Main Content */}
        <Box sx={{ position: "relative", maxWidth: 1000, mx: "auto" }}>
          {/* Desktop Navigation Arrows - Maiores e mais grossas */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              left: { md: -100, lg: -140 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
            }}
          >
            <StyledIconButton onClick={handlePrev} aria-label="Depoimento anterior">
              <ChevronLeft />
            </StyledIconButton>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              right: { md: -100, lg: -140 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
            }}
          >
            <StyledIconButton onClick={handleNext} aria-label="Próximo depoimento">
              <ChevronRight />
            </StyledIconButton>
          </Box>

          {/* Content Grid */}
          <Box
            sx={{
              display: { xs: "flex", md: "grid" },
              flexDirection: { xs: "column", md: "row" },
              gridTemplateColumns: { md: "280px 1fr", lg: "320px 1fr" },
              gap: { xs: 3, sm: 4, md: 6, lg: 8 },
              alignItems: "center",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {/* Left Column - Avatar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                flexShrink: 0,
              }}
            >
              <StyledAvatar>
                <Image
                  src={currentTestimonial.image || "/placeholder.svg"}
                  alt={currentTestimonial.name}
                  width={400}
                  height={400}
                  quality={100}
                  priority={currentIndex === 0}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center center",
                  }}
                />
              </StyledAvatar>
            </Box>

            {/* Right Column - Content */}
            <Box sx={{ width: "100%", px: { xs: 2, sm: 3, md: 0 } }}>
              {/* Star Rating */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-start" },
                  mb: { xs: 1.5, sm: 2, md: 2.5 },
                }}
              >
                <Rating
                  value={currentTestimonial.rating}
                  readOnly
                  size="small"
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: "#ffc107",
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                    },
                  }}
                />
              </Box>

              {/* Quote */}
              <Box sx={{ mb: { xs: 2, sm: 3, md: 4 }, position: "relative" }}>
                <Typography
                  sx={{
                    position: "relative",
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.125rem" },
                    lineHeight: { xs: 1.5, md: 1.6 },
                    color: "grey.700",
                    pl: { xs: 2, md: 3 },
                    pr: { xs: 1, md: 2 },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      position: "absolute",
                      left: { xs: -6, sm: -8, md: -12 },
                      top: { xs: -6, sm: -8, md: -12 },
                      fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                      color: "grey.400",
                      fontFamily: "serif",
                      lineHeight: 1,
                    }}
                  >
                    &ldquo;
                  </Box>
                  {currentTestimonial.content}
                  <Box
                    component="span"
                    sx={{
                      position: "absolute",
                      right: { xs: -3, sm: -4, md: -8 },
                      bottom: { xs: -12, sm: -16, md: -20 },
                      fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                      color: "grey.400",
                      fontFamily: "serif",
                      lineHeight: 1,
                    }}
                  >
                    &rdquo;
                  </Box>
                </Typography>
              </Box>

              {/* Linha vermelha abaixo do depoimento */}
              <Box
                sx={{
                  width: { xs: 30, sm: 40, md: 48 },
                  height: { xs: 2, md: 3 },
                  bgcolor: "#ff7043",
                  mb: { xs: 1.5, md: 2 },
                  mx: { xs: "auto", md: 0 },
                }}
              />

              {/* Attribution */}
              <Box>
                <Typography
                  component="span"
                  sx={{
                    fontWeight: "bold",
                    color: "text.primary",
                    fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" },
                  }}
                >
                  {currentTestimonial.name}:
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    color: "text.secondary",
                    ml: 0.5,
                    fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" },
                  }}
                >
                  {currentTestimonial.role}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Mobile Navigation */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              justifyContent: "center",
              gap: { xs: 2, sm: 4 },
              mt: { xs: 2, sm: 3 },
            }}
          >
            <StyledIconButton onClick={handlePrev} aria-label="Depoimento anterior">
              <ChevronLeft />
            </StyledIconButton>
            <StyledIconButton onClick={handleNext} aria-label="Próximo depoimento">
              <ChevronRight />
            </StyledIconButton>
          </Box>

          {/* Pagination Dots */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: 0.5, sm: 1 },
              mt: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {testimonials.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: 8, sm: 10, md: 12 },
                  height: { xs: 8, sm: 10, md: 12 },
                  borderRadius: "50%",
                  bgcolor: index === currentIndex ? "grey.700" : "grey.300",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": {
                    bgcolor: index === currentIndex ? "grey.700" : "grey.400",
                  },
                }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default TestimonialsSection
