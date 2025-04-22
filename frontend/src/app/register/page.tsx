"use client";
import RegisterForm from '../../components/RegisterForm';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const RegisterPage = () => {
  return (
    <>
      <Header />
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="70vh" padding={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Registro
        </Typography>
        <RegisterForm />
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

export default RegisterPage;