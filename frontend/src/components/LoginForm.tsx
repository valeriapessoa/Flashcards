"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setEmailError('');
    setPasswordError('');
    setError('');

    if (!email) {
      setEmailError('Email é obrigatório');
      setIsSubmitting(false);
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Email inválido');
      setIsSubmitting(false);
      return;
    }
    if (!password) {
      setPasswordError('Senha é obrigatória');
      setIsSubmitting(false);
      return;
    }
    if (password.length < 6) {
      setPasswordError('Senha deve ter pelo menos 6 caracteres');
      setIsSubmitting(false);
      return;
    }

    const res = await signIn('credentials', { redirect: false, email, password });
    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        setError("Email ou senha inválidos. Verifique suas credenciais.");
      } else {
        setError(res.error);
      }
      setIsSubmitting(false);
    } else if (!res?.ok) {
      setError("Falha no login. Tente novamente mais tarde.");
      setIsSubmitting(false);
    } else {
      router.push('/');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        margin="normal"
        required
        error={!!emailError}
        helperText={emailError}
      />
      <TextField
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
        required
        error={!!passwordError}
        helperText={passwordError}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Login'}
      </Button>
      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
      <Box 
        mt={3} 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        gap={2} 
        width="100%"
        sx={{
          '& .MuiButton-root': {
            width: { xs: '100%', sm: 'auto' },
            maxWidth: { xs: '100%', sm: '200px' },
            fontSize: { xs: '0.85rem', sm: '0.9rem' },
            px: { xs: 2, sm: 3 },
            py: { xs: 1.25, sm: 1.5 },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          },
          '& .MuiButton-startIcon': {
            marginRight: { xs: 1, sm: 1.5 }
          }
        }}
      >
        <Typography variant="body2" color="text.secondary" mb={1}>
          Ou entre com
        </Typography>
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }} 
          gap={{ xs: 2, sm: 3 }} 
          width="100%" 
          maxWidth={{ xs: '100%', sm: 'fit-content' }}
        >
          <Button
            onClick={() => signIn('google')}
            variant="outlined"
            startIcon={
              <Box 
                component="span" 
                sx={{
                  width: { xs: 20, sm: 24 },
                  height: { xs: 20, sm: 24 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <GoogleIcon sx={{ color: '#DB4437', fontSize: { xs: 20, sm: 22 } }} />
              </Box>
            }
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              borderColor: '#e0e0e0',
              color: '#5f6368',
              fontWeight: 500,
              boxShadow: '0 1px 2px 0 rgba(60,64,67,.1), 0 1px 3px 1px rgba(60,64,67,.15)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
                backgroundColor: 'rgba(66, 133, 244, 0.04)',
                borderColor: '#d2e3fc'
              }
            }}
          >
            Google
          </Button>
          <Button
            onClick={() => signIn('facebook')}
            variant="outlined"
            startIcon={
              <Box 
                component="span" 
                sx={{
                  width: { xs: 20, sm: 24 },
                  height: { xs: 20, sm: 24 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FacebookIcon sx={{ color: '#1877F2', fontSize: { xs: 20, sm: 24 } }} />
              </Box>
            }
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              borderColor: '#e0e0e0',
              color: '#1c1e21',
              fontWeight: 500,
              boxShadow: '0 1px 2px 0 rgba(60,64,67,.1), 0 1px 3px 1px rgba(60,64,67,.15)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
                backgroundColor: 'rgba(24, 119, 242, 0.04)',
                borderColor: '#d2e3fc'
              }
            }}
          >
            Facebook
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default LoginForm;