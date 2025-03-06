import React from 'react';
import { Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <footer>
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="https://flashcards-app.com/">
            Flashcards App
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;