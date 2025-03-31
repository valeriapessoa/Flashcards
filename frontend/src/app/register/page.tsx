"use client";
import RegisterForm from '../../components/RegisterForm';
import { Box, Typography } from '@mui/material';

const RegisterPage = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Registro
      </Typography>
      <RegisterForm />
    </Box>
  );
};

export default RegisterPage;