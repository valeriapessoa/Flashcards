"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Box, IconButton } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

const LoginForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setError('');

    if (!email) {
      setEmailError('Email é obrigatório');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Email inválido');
      return;
    }
    if (!password) {
      setPasswordError('Senha é obrigatória');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    const res = await signIn('credentials', { redirect: false, email, password });
    if (res?.error) {
      // Mapeia o erro padrão "CredentialsSignin" para uma mensagem mais amigável
      if (res.error === "CredentialsSignin") {
        setError("Email ou senha inválidos. Verifique suas credenciais.");
      } else {
        setError(res.error); // Exibe outros erros que possam ocorrer (menos comuns aqui)
      }
    } else if (!res?.ok) {
        // Fallback para caso de falha sem erro específico (pouco provável com Credentials)
        setError("Falha no login. Tente novamente mais tarde.");
    } else {
      setIsLoggedIn(true);
      setWelcomeMessage('Bem-vindo!');
      router.push('/');
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
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Login
      </Button>
      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
       <Box mt={2} textAlign="center">
         <Typography variant="body2">
           Não tem uma conta? <Button color="secondary" onClick={() => router.push('/register')}>Cadastre-se</Button>
         </Typography>
       </Box>
       <Box mt={2} display="flex" justifyContent="center" gap={2}>
         <IconButton onClick={() => signIn('google')} color="primary">
           <GoogleIcon />
         </IconButton>
         <IconButton onClick={() => signIn('facebook')} color="primary">
           <FacebookIcon />
         </IconButton>
       </Box>
    </form>
  );
};

export default LoginForm;