"use client";
import { useRouter } from 'next/router';
import LoginForm from '../../components/LoginForm';
import { Box, Typography } from '@mui/material';

const LoginPage = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <LoginForm />
    </Box>
  );
};

export default LoginPage;