import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{
      background: 'linear-gradient(90deg, #f5f7fa 0%, #e3e9f0 100%)',
      mt: 8,
      pt: 4,
      pb: 2,
      borderTop: '1.5px solid #ececec',
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Flashcards App</Typography>
            <Typography variant="body2" color="text.secondary">
              Aprenda de forma inteligente e divertida. Organize, crie e revise seus flashcards em qualquer lugar!
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Links úteis</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Link href="/" color="inherit" underline="hover">Início</Link>
              <Link href="/criar-flashcard" color="inherit" underline="hover">Criar Flashcard</Link>
              <Link href="/estudar" color="inherit" underline="hover">Estudar</Link>
              <Link href="/flashcards" color="inherit" underline="hover">Meus Flashcards</Link>
              <Link href="/revisao-inteligente" color="inherit" underline="hover">Revisão Inteligente</Link>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>Contato</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton href="mailto:contato@flashcards-app.com" color="primary" size="small" aria-label="Email">
                <EmailIcon fontSize="small" />
              </IconButton>
              <IconButton href="https://github.com/valeriapessoa/Flashcards" target="_blank" color="primary" size="small" aria-label="GitHub">
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton href="/sobre" color="primary" size="small" aria-label="Sobre">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              contato@flashcards-app.com
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright '}
          <Link color="inherit" href="https://flashcards-app.com/">
            Flashcards App
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;