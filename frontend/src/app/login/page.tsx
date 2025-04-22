"use client";
import { useRouter } from 'next/router';
import Link from 'next/link';
import LoginForm from '../../components/LoginForm';
import { Box, Typography, Button } from '@mui/material';

const LoginPage = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" padding={3}>
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
  );
};

export default LoginPage;