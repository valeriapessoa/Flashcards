import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider, IconButton } from '@mui/material';
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';
import { usePathname } from 'next/navigation';


const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{
      background: '#1976d2',
      mt: 4,
      pt: 4,
      pb: 4,
      borderTop: '1px solid rgba(255,255,255,0.1)',
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2, color: 'white' }}>
                Flashcards App
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'white' }}>
                Aprenda de forma inteligente e divertida. Organize, crie e revise seus flashcards em qualquer lugar!
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ mb: 2, color: 'white' }}>
                Siga-nos
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 2 }}>
                <IconButton 
                  href="https://facebook.com/flashcards-app" 
                  target="_blank" 
                  color="inherit" 
                  size="medium" 
                  aria-label="Facebook"
                  sx={{ 
                    borderRadius: '50%',
                    transition: 'transform 0.2s',
                    '&:hover': { 
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <FaFacebook style={{ fontSize: '1.5rem', color: 'white' }} />
                </IconButton>
                <IconButton 
                  href="https://instagram.com/flashcards-app" 
                  target="_blank" 
                  color="inherit" 
                  size="medium" 
                  aria-label="Instagram"
                  sx={{ 
                    borderRadius: '50%',
                    transition: 'transform 0.2s',
                    '&:hover': { 
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <FaInstagram style={{ fontSize: '1.5rem', color: 'white' }} />
                </IconButton>
                <IconButton 
                  href="https://twitter.com/flashcards-app" 
                  target="_blank" 
                  color="inherit" 
                  size="medium" 
                  aria-label="Twitter"
                  sx={{ 
                    borderRadius: '50%',
                    transition: 'transform 0.2s',
                    '&:hover': { 
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <FaTwitter style={{ fontSize: '1.5rem', color: 'white' }} />
                </IconButton>
                <IconButton 
                  href="https://tiktok.com/@flashcards-app" 
                  target="_blank" 
                  color="inherit" 
                  size="medium" 
                  aria-label="TikTok"
                  sx={{ 
                    borderRadius: '50%',
                    transition: 'transform 0.2s',
                    '&:hover': { 
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <FaTiktok style={{ fontSize: '1.5rem', color: 'white' }} />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4, borderColor: 'white' }} />
        <Typography variant="body2" align="center" sx={{ mt: 2, color: 'white' }}>
          {new Date().getFullYear()} Flashcards App – Todos os direitos reservados – Desenvolvido por Valéria Pessoa
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;