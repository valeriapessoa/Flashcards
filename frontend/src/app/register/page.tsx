"use client";
import RegisterForm from '../../components/RegisterForm';
import { Box, Typography, Button, Card, CardContent, useTheme } from '@mui/material';
import Link from 'next/link';
import Footer from '../../components/Footer';

const RegisterPage = () => {
  const theme = useTheme();
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="75vh"
        sx={{
          py: { xs: 2, md: 4 },
        }}
      >
        <Card sx={{ maxWidth: 400, width: '100%', boxShadow: 4, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Crie sua conta
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center" mb={2}>
              Registre-se para começar a organizar e estudar seus flashcards.
            </Typography>
            <RegisterForm />
            <Box mt={2} display="flex" justifyContent="center">
              {/* Removido link para o Dashboard */}
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </>
  );
};

export default RegisterPage;