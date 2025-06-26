"use client";

import LoginForm from '../../components/LoginForm';
import { Box, Typography, Card, CardContent, Link as MuiLink, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <Box 
      minHeight="100vh" 
      display="flex" 
      flexDirection="column" 
      justifyContent={{ xs: 'flex-start', sm: 'center' }}
      alignItems="center" 
      bgcolor="#F6F8FC"
      pt={{ xs: 4, sm: 0 }}
      px={2}
    >
      <Link href="/" passHref>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          sx={{
            position: { xs: 'relative', sm: 'absolute' },
            top: { sm: 20 },
            left: { sm: 20 },
            color: '#1976d2',
            alignSelf: { xs: 'flex-start', sm: 'auto' },
            mb: { xs: 2, sm: 0 },
            pl: { xs: 0, sm: 1 },
            '&:hover': {
              color: '#1557b0',
              backgroundColor: 'transparent'
            }
          }}
        >
          Voltar
        </Button>
      </Link>
      <Card 
        sx={{ 
          width: '100%', 
          maxWidth: 400, 
          boxShadow: { xs: 'none', sm: 4 },
          borderRadius: { xs: 0, sm: 3 },
          bgcolor: { xs: 'transparent', sm: 'background.paper' },
          p: { xs: 0, sm: 2 }
        }}
      >
        <CardContent sx={{ p: { xs: 0, sm: 2 } }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              fontWeight: 600,
              color: { xs: '#1976d2', sm: 'inherit' }
            }}
          >
            Bem-vindo de volta!
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center" 
            mb={3}
            sx={{
              fontSize: { xs: '0.95rem', sm: '1rem' },
              px: { xs: 1, sm: 0 }
            }}
          >
            Faça login para acessar seus flashcards e continuar estudando.
          </Typography>
          <LoginForm />
          <Box mt={3} display="flex" justifyContent="center">
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                textAlign: 'center',
                color: 'text.secondary'
              }}
            >
              Ainda não tem uma conta?{' '}
              <MuiLink 
                href="/register" 
                sx={{ 
                  color: '#1976d2', 
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Registre-se
              </MuiLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;