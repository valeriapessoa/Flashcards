import { Box, Grid, Typography, Card } from "@mui/material"
import HowToRegIcon from "@mui/icons-material/HowToReg"
import FlashOnIcon from "@mui/icons-material/FlashOn"
import QuizIcon from "@mui/icons-material/Quiz"
import TimelineIcon from "@mui/icons-material/Timeline"

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <HowToRegIcon color="primary" sx={{ fontSize: { xs: 50, sm: 60, md: 70 }, mb: { xs: 1.5, md: 2 } }} />,
      title: "1. Registre-se",
      description: "Crie sua conta e comece a usar o Flashcards Inteligentes.",
    },
    {
      icon: <FlashOnIcon color="primary" sx={{ fontSize: { xs: 50, sm: 60, md: 70 }, mb: { xs: 1.5, md: 2 } }} />,
      title: "2. Crie Flashcards",
      description:
        "Adicione perguntas e respostas em seus próprios flashcards personalizados. Organize-os em categorias para facilitar seu estudo.",
    },
    {
      icon: <QuizIcon color="primary" sx={{ fontSize: { xs: 50, sm: 60, md: 70 }, mb: { xs: 1.5, md: 2 } }} />,
      title: "3. Estude Interativamente",
      description:
        "Revise seus flashcards em modo de estudo interativo. Responda perguntas e obtenha feedback imediato.",
    },
    {
      icon: <TimelineIcon color="primary" sx={{ fontSize: { xs: 50, sm: 60, md: 70 }, mb: { xs: 1.5, md: 2 } }} />,
      title: "4. Revisão Inteligente",
      description:
        "O sistema identifica seus pontos fracos e prioriza a revisão dos conteúdos que você mais precisa revisar.",
    },
  ]

  return (
    <Box sx={{ 
      bgcolor: "#f8f9fa", 
      py: { xs: 6, sm: 8, md: 10 },
      px: 0
    }}>
      <Box sx={{ 
        maxWidth: { xs: '100%', md: '100%' },
        mx: 0,
        px: { xs: 0.5, sm: 1, md: 2 },
        width: '100%'
      }}>
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
        <Typography
          variant="h4"
          component="h2"
          color="primary"
          sx={{
            fontSize: { xs: "1.75rem", md: "2.25rem", lg: "2.5rem" },
            letterSpacing: "0.05em",
            mb: 2,
            fontWeight: 700,
            textTransform: "capitalize",
          }}
        >
          Como Funciona
        </Typography>
        <Box
          sx={{
            width: { xs: 60, sm: 80, md: 80 },
            height: { xs: 3, md: 4 },
            bgcolor: "#ff7043",
            mx: "auto",
            mb: 4,
          }}
        />
      </Box>
      <Grid container spacing={3} sx={{ width: '100%', m: 0, px: { xs: 2, sm: 3, md: 4 } }}>
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index} sx={{ display: 'flex', p: 1.5, boxSizing: 'border-box' }}>
            <Card
              sx={{
                height: "100%",
                width: '100%',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: { xs: 2, sm: 2.5, md: 3, lg: 3 },
                bgcolor: "background.paper",
                boxShadow: 3,
                border: '1px solid rgba(0,0,0,0.1)',
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                  borderColor: 'primary.main',
                },
              }}
            >
              {step.icon}
              <Typography
                variant="h5"
                fontWeight="bold"
                mb={{ xs: 1.5, md: 2 }}
                sx={{
                  fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                  textAlign: "center",
                }}
              >
                {step.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                mb={2}
                sx={{
                  fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem" },
                  textAlign: "center",
                  lineHeight: { xs: 1.4, md: 1.5 },
                }}
              >
                {step.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  </Box>
  )
}

export default HowItWorksSection
