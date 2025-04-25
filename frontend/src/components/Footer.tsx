import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import InfoIcon from '@mui/icons-material/Info';
import { usePathname } from 'next/navigation';

const Footer: React.FC = () => {
  const pathname = usePathname();
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Criar Flashcard', href: '/criar-flashcard' },
    { label: 'Estudar', href: '/estudar' },
    { label: 'Flashcards', href: '/flashcards' },
    { label: 'Revisão Inteligente', href: '/revisao-inteligente' },
  ];

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
              {links.map(link => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{ textDecoration: 'none' }}
                    sx={{
                      color: isActive ? '#1976d2' : '#222',
                      fontWeight: 400,
                      px: 0,
                      py: 0.5,
                      borderRadius: 0,
                      background: 'none',
                      transition: 'color 0.15s',
                      '&:hover': {
                        color: '#1565c0',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
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
          <Link color="inherit" href="https://flashcards-app.com/" style={{ textDecoration: 'underline' }}>
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