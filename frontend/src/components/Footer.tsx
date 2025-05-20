import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider, IconButton } from '@mui/material';
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';
import { usePathname } from 'next/navigation';


const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{
      background: 'linear-gradient(90deg, #f5f7fa 0%, #e3e9f0 100%)',
      mt: 4,
      pt: 3,
      pb: 2,
      borderTop: '1.5px solid #ececec',
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ pt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
                Flashcards App
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Aprenda de forma inteligente e divertida. Organize, crie e revise seus flashcards em qualquer lugar!
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ mb: 1 }}>
                Siga-nos
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
                <IconButton 
                  href="https://facebook.com/flashcards-app" 
                  target="_blank" 
                  color="primary" 
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
                  <FaFacebook style={{ fontSize: '1.5rem' }} />
                </IconButton>
                <IconButton 
                  href="https://instagram.com/flashcards-app" 
                  target="_blank" 
                  color="primary" 
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
                  <FaInstagram style={{ fontSize: '1.5rem' }} />
                </IconButton>
                <IconButton 
                  href="https://twitter.com/flashcards-app" 
                  target="_blank" 
                  color="primary" 
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
                  <FaTwitter style={{ fontSize: '1.5rem' }} />
                </IconButton>
                <IconButton 
                  href="https://tiktok.com/@flashcards-app" 
                  target="_blank" 
                  color="primary" 
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
                  <FaTiktok style={{ fontSize: '1.5rem' }} />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {'© '}
            {new Date().getFullYear()}
            {' - Flashcards App - Todos os direitos reservados - Termos de Uso e Política de Privacidade - Desenvolvido por Valéria Pessoa'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;