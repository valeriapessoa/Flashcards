"use client";
import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Criar Flashcard', href: '/criar-flashcard' },
  { label: 'Estudar', href: '/estudar' },
  { label: 'Flashcards', href: '/flashcards' },
  { label: 'Revisão Inteligente', href: '/revisao-inteligente' },
];

const Header: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: '#fff',
        color: '#222',
        boxShadow: '0 2px 12px #0001',
        borderBottom: '1.5px solid #ececec',
        py: 0.5,
        minHeight: 60,
        zIndex: 1201,
      }}
    >
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: 2, minHeight: 54 }}>
        {/* Logo minimalista */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 5, cursor: 'pointer', gap: 1 }} onClick={() => router.push('/') }>
          <FlashOnIcon sx={{ fontSize: 28, color: '#FFD600', mr: 0.8 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#222', fontFamily: 'Montserrat, Arial', letterSpacing: 0.5 }}>
            Flashcards
          </Typography>
        </Box>
        {/* Menu centralizado */}
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center', gap: 2.5 }}>
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Button
                key={item.label}
                component={Link}
                href={item.href}
                sx={{
                  position: 'relative',
                  color: isActive ? '#1976d2' : '#444',
                  fontWeight: isActive ? 800 : 500,
                  fontSize: 16,
                  textTransform: 'none',
                  letterSpacing: 0.5,
                  px: 1.5,
                  py: 0.5,
                  minWidth: 80,
                  background: 'none',
                  borderRadius: 1,
                  boxShadow: 'none',
                  overflow: 'hidden',
                  transition: 'color 0.18s',
                  '&:after': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    bottom: 4,
                    height: 3,
                    borderRadius: 2,
                    background: isActive ? '#1976d2' : 'transparent',
                    transition: 'background 0.25s, width 0.25s',
                    width: isActive ? 'calc(100% - 32px)' : 0,
                  },
                  '&:hover': {
                    color: '#1976d2',
                    background: 'rgba(25, 118, 210, 0.06)',
                  },
                  '&:hover:after': {
                    background: '#90caf9',
                    width: 'calc(100% - 32px)',
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>
        {/* Login/Logout à direita */}
        {session && session.user ? (
          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            variant="outlined"
            sx={{
              ml: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: 16,
              border: '2px solid #1976d2',
              color: '#1976d2',
              background: 'none',
              px: 3,
              py: 1,
              minWidth: 100,
              fontFamily: 'Montserrat, Arial, sans-serif',
              letterSpacing: 0.5,
              boxShadow: 'none',
              '&:hover': {
                background: '#e3f2fd',
                color: '#1976d2',
                border: '2.5px solid #1976d2',
              },
            }}
          >
            Sair
          </Button>
        ) : (
          <Button
            component={Link}
            href="/login"
            variant="outlined"
            sx={{
              ml: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: 16,
              border: '2px solid #1976d2',
              color: '#1976d2',
              background: 'none',
              px: 3,
              py: 1,
              minWidth: 100,
              fontFamily: 'Montserrat, Arial, sans-serif',
              letterSpacing: 0.5,
              boxShadow: 'none',
              '&:hover': {
                background: '#e3f2fd',
                color: '#1976d2',
                border: '2.5px solid #1976d2',
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