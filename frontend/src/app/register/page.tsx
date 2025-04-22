"use client";
import RegisterForm from '../../components/RegisterForm';
import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

const RegisterPage = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={3}>
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
  );
};

export default RegisterPage;