import { Button, Typography, Box, Grid } from "@mui/material"
import Link from "next/link"
import Image from "next/image"

const HeroSection = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "calc(100vh - 64px)",
        bgcolor: "linear-gradient(135deg, #e3f2fd 60%, #fff 100%)",
        pt: 0,
        pb: { xs: 4, md: 6 },
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Grid
        container
        spacing={6}
        alignItems="center"
        justifyContent="center"
        sx={{
          maxWidth: "1400px",
          width: "100%",
          mx: "auto",
          px: { xs: 1.2, md: 6 },
          py: { xs: 2, md: 8 },
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          lg={6}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            pt: { xs: 1, md: 4 },
            pl: { xs: "1px !important", md: undefined },
          }}
        >
          <Box
            sx={{
              maxWidth: "600px",
              mx: "auto",
              textAlign: { xs: "center", md: "left" },
              px: { xs: 1.2, md: 4 },
              mt: { xs: 1, md: 0 },
            }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "4rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                mb: { xs: 2, md: 3 },
                color: "primary.main",
              }}
            >
              Torne seu aprendizado mais eficiente
            </Typography>
            <Box
              sx={{
                width: { xs: 50, md: 100 },
                height: { xs: 3, md: 4 },
                bgcolor: "#ff7043",
                mb: { xs: 3, md: 4 },
                mx: { xs: "auto", md: 0 },
              }}
            />
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.75rem" },
                fontWeight: 400,
                color: "text.secondary",
                mb: { xs: 3, md: 3 },
                lineHeight: 1.4,
              }}
            >
              {/* Texto da imagem para mobile */}
              <Box component="span" sx={{ display: { xs: "block", md: "none" } }}>
                Organize, memorize e revise com Flashcards modernos para dispositivos móveis e tablets
              </Box>
              {/* Texto original para desktop */}
              <Box component="span" sx={{ display: { xs: "none", md: "block" } }}>
              Organize, memorize e revise com Flashcards modernos para dispositivos móveis e tablets
              </Box>
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 2, md: 3 },
                justifyContent: { xs: "center", md: "flex-start" },
                mt: { xs: 3, md: 4 },
              }}
            >
              <Button
                component={Link}
                href="/estudar"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 0.75, sm: 1, md: 1.5 },
                  fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.1rem" },
                  fontWeight: 600,
                  borderRadius: "8px",
                  textTransform: "none",
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
                  px: { xs: 2, sm: 3, md: 4 },
                  py: { xs: 0.75, sm: 1, md: 1.5 },
                  fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1.1rem" },
                  fontWeight: 600,
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                Saiba Mais
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={6} sx={{ position: "relative", height: "100%" }}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
              "& img": {
                objectFit: "contain !important",
              },
            }}
          >
            <Image
              src="/images/mascote33.png"
              alt="Bem-vindo ao Flashcard"
              width={800}
              height={800}
              priority
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "70vh",
                objectFit: "contain",
                filter: "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default HeroSection
