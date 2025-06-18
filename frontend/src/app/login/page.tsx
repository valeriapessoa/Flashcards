"use client";
import LoginForm from '../../components/LoginForm';
import { Box, Typography, Card, CardContent, Link as MuiLink, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" bgcolor="#F6F8FC">
      <Link href="/" passHref>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            color: '#1976d2',
            '&:hover': {
              color: '#1557b0'
            }
          }}
        >
          Voltar
        </Button>
      </Link>
      <Card sx={{ maxWidth: 400, width: '100%', boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Bem-vindo de volta!
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" mb={2}>
            Faça login para acessar seus flashcards e continuar estudando.
          </Typography>
          <LoginForm />
          <Box mt={2} display="flex" justifyContent="center">
            <Typography variant="body2" color="text.secondary">
              Ainda não tem uma conta?
              <MuiLink href="/register" style={{ marginLeft: 4, color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}>
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