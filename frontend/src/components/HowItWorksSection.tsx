import { Box, Grid, Typography, Card } from "@mui/material";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import QuizIcon from '@mui/icons-material/Quiz';
import TimelineIcon from '@mui/icons-material/Timeline';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <HowToRegIcon color="primary" sx={{ fontSize: 70, mb: 2 }} />,
      title: "1. Registre-se",
      description: "Crie sua conta e comece a usar o Flashcards Inteligentes."
    },
    {
      icon: <FlashOnIcon color="primary" sx={{ fontSize: 70, mb: 2 }} />,
      title: "2. Crie Flashcards",
      description: "Adicione perguntas e respostas em seus próprios flashcards personalizados. Organize-os em categorias para facilitar seu estudo."
    },
    {
      icon: <QuizIcon color="primary" sx={{ fontSize: 70, mb: 2 }} />,
      title: "3. Estude Interativamente",
      description: "Revise seus flashcards em modo de estudo interativo. Responda perguntas e obtenha feedback imediato."
    },
    {
      icon: <TimelineIcon color="primary" sx={{ fontSize: 70, mb: 2 }} />,
      title: "4. Revisão Inteligente",
      description: "O sistema identifica seus pontos fracos e prioriza a revisão dos conteúdos que você mais precisa revisar."
    }
  ];

  return (
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
        {steps.map((step, index) => (
          <Grid item xs={12} md={3} key={index}>
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
              {step.icon}
              <Typography variant="h5" fontWeight="bold" mb={2}>
                {step.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={2}>
                {step.description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HowItWorksSection;
