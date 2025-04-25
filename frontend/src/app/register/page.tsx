"use client";
import RegisterForm from '../../components/RegisterForm';
import { Box, Typography, Button, Card, CardContent, useTheme, Container, Link } from '@mui/material';

const RegisterPage = () => {
  const theme = useTheme();
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" bgcolor="#F6F8FC">
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
            <Typography variant="body2" color="text.secondary">
              Já tem uma conta?
              <Link href="/login" style={{ marginLeft: 4, color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}>
                Faça login
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;