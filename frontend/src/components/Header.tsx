"use client";
import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const navItems = [
  { label: 'Criar Flashcard', href: '/criar-flashcard' },
  { label: 'Estudar', href: '/estudar' },
  { label: 'Flashcards', href: '/flashcards' },
  { label: 'Revisão Inteligente', href: '/revisao-inteligente' },
];

const Header: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={0} sx={{ background: '#fff', color: '#222', boxShadow: 'none', py: 2 }}>
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: 2, minHeight: 80 }}>
        {/* Logo */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#111',
            letterSpacing: 1,
            mr: 6,
            flexShrink: 0,
            cursor: 'pointer',
            fontFamily: 'Montserrat, Arial, sans-serif',
          }}
          onClick={() => router.push('/')}
        >
          Flashcards<span style={{ color: '#FFD600' }}>.</span>
        </Typography>
        {/* Menu centralizado */}
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', gap: 2 }}>
          {navItems.map((item, idx) => (
            <Button
              key={item.label}
              component={Link}
              href={item.href}
              sx={{
                color: idx === 0 ? '#111' : '#7b88a8',
                fontWeight: idx === 0 ? 700 : 500,
                fontSize: 18,
                textTransform: 'none',
                background: 'none',
                borderRadius: 2,
                px: 2.5,
                py: 1.5,
                boxShadow: 'none',
                '&:hover': {
                  color: '#1976d2',
                  background: '#f5f7fa',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
        {/* Login/Avatar à direita */}
        {session && session.user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar alt={session.user.name || 'Usuário'} src={session.user.image || undefined} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem disabled>{session.user.name}</MenuItem>
              <MenuItem onClick={() => { signOut(); handleClose(); }}>Sair</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button
            component={Link}
            href="/login"
            variant="contained"
            sx={{
              ml: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: 18,
              background: 'linear-gradient(90deg, #1976d2 70%, #21c6fb)',
              boxShadow: '0 2px 8px #1976d210',
              px: 4,
              py: 1.5,
              minWidth: 110,
              fontFamily: 'Montserrat, Arial, sans-serif',
              '&:hover': {
                background: 'linear-gradient(90deg, #1565c0 70%, #21c6fb)',
              },
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;