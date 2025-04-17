"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Box } from '@mui/material';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
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
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setError('');

    if (!name) {
      setNameError('Nome é obrigatório');
      setIsSubmitting(false);
      return;
    }
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
    if (password !== confirmPassword) {
      setConfirmPasswordError('Senhas não conferem');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || 'Erro ao registrar usuário');
        setIsSubmitting(false);
        return;
      }

      const userData = await res.json();
      if (userData.id) { 
        router.push('/auth');
      } else {
        setError('Erro ao registrar usuário');
      }
      setIsSubmitting(false);
    } catch (error) {
      setError('Erro ao registrar usuário');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
       <TextField
        label="Nome"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="normal"
        required
        error={!!nameError}
        helperText={nameError}
      />
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
       <TextField
        label="Confirmar Senha"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
        margin="normal"
        required
        error={!!confirmPasswordError}
        helperText={confirmPasswordError}
      />
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Registrando...' : 'Registrar'}
      </Button>
      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
    </form>
  );
};

export default RegisterForm;