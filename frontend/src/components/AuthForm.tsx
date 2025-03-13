import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('email', { redirect: false, email, password });
    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/dashboard');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogleLogin = () => signIn('google');
  const handleFacebookLogin = () => signIn('facebook');

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" gutterBottom>
          Login/Registro
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Nome"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login/Registro
          </Button>
        </form>
        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}
        <Box mt={2}>
          <Button variant="outlined" color="primary" fullWidth onClick={handleGoogleLogin}>
            Login com Google
          </Button>
          <Button variant="outlined" color="primary" fullWidth onClick={handleFacebookLogin}>
            Login com Facebook
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AuthForm;
















