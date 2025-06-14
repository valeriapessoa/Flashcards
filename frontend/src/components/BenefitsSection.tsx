import { Box, Grid, Typography } from "@mui/material";
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import DevicesIcon from '@mui/icons-material/Devices';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <EmojiObjectsIcon color="primary" sx={{ fontSize: 48, mb: 3 }} />,
      title: "Memorização Eficiente",
      description: "Otimize seu tempo focando nos conteúdos que mais precisa revisar."
    },
    {
      icon: <DevicesIcon color="secondary" sx={{ fontSize: 48, mb: 3 }} />,
      title: "Acesse de Qualquer Lugar",
      description: "Estude no computador, tablet ou celular, mesmo offline."
    },
    {
      icon: <FlashOnIcon color="warning" sx={{ fontSize: 48, mb: 3 }} />,
      title: "Revisão Inteligente",
      description: "Sistema que prioriza os flashcards que você mais erra para melhorar a retenção."
    },
    {
      icon: <AddCircleOutlineIcon color="success" sx={{ fontSize: 48, mb: 3 }} />,
      title: "Crie Seus Próprios Cards",
      description: "Personalize seus estudos criando flashcards com o conteúdo que você precisa aprender."
    },
    {
      icon: <AutoAwesomeIcon color="warning" sx={{ fontSize: 48, mb: 3 }} />,
      title: "Interface Intuitiva",
      description: "Design limpo e fácil de usar, para que você possa focar apenas nos estudos."
    },
    {
      icon: <SchoolIcon color="info" sx={{ fontSize: 48, mb: 3 }} />,
      title: "Aprendizado Eficaz",
      description: "Método comprovado para melhorar sua retenção de conteúdo de forma eficiente."
    }
  ];

  return (
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
        {benefits.map((benefit, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Box sx={{ 
              borderRadius: 4, 
              textAlign: 'center', 
              py: 4, 
              bgcolor: 'transparent', 
              height: '100%',
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              {benefit.icon}
              <Typography variant="h6" component="h4" fontWeight={600} gutterBottom>
                {benefit.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', px: 2 }}>
                {benefit.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BenefitsSection;
