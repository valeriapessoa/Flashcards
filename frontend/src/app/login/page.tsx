"use client";
import { useRouter } from 'next/router';
import Link from 'next/link';
import LoginForm from '../../components/LoginForm';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Box, Typography, Button } from '@mui/material';

const LoginPage = () => {
  return (
    <>
      <Header />
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="70vh" padding={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <LoginForm />
        <Box mt={2}>
          <Link href="/dashboard" passHref legacyBehavior>
            <Button variant="text" color="secondary">
              Voltar ao Dashboard
            </Button>
          </Link>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default LoginPage;