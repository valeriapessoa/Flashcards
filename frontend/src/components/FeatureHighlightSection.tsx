import { Box, Grid, Typography } from '@mui/material';
import Image from 'next/image';

const FeatureHighlightSection = () => {
  return (
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
  );
};

export default FeatureHighlightSection;
