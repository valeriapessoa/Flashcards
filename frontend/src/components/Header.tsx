import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Flashcards App
        </Typography>
        <Button color="inherit" component={Link} href="/auth">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;