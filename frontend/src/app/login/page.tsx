"use client";
import { useRouter } from 'next/router';
import Link from 'next/link';
import LoginForm from '../../components/LoginForm';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Box, Typography, Button, Card, CardContent, useTheme } from '@mui/material';

const LoginPage = () => {
  const theme = useTheme();
  return (
    <>
      <Header />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="75vh"
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.background.default} 100%)`,
          py: { xs: 2, md: 4 },
        }}
      >
        <Card sx={{ maxWidth: 370, width: '100%', boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Bem-vindo de volta!
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" mb={2}>
              Faça login para acessar seus flashcards e continuar estudando.
            </Typography>
            <LoginForm />
            <Box mt={2} display="flex" justifyContent="center">
              <Link href="/dashboard" passHref legacyBehavior>
                <Button variant="text" color="secondary" size="small">
                  Voltar ao Dashboard
                </Button>
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </>
  );
};

export default LoginPage;