"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  useMediaQuery, 
  useTheme,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Criar', href: '/criar-flashcard' },
  { label: 'Flashcards', href: '/flashcards' },
  { label: 'Estudar', href: '/estudar' },
  { label: 'Revisão Inteligente', href: '/revisao-inteligente' },
];

const Header: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box 
      onClick={handleDrawerToggle}
      sx={{ 
        width: 250,
        height: '100%',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        p: 2
      }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ pt: 8 }}>
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton 
                component={Link} 
                href={item.href}
                selected={isActive}
                sx={{
                  color: isActive ? '#1976d2' : '#444',
                  fontWeight: isActive ? 800 : 500,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.13)',
                    },
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

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
      <Toolbar 
        sx={{ 
          maxWidth: 1200, 
          width: '100%', 
          mx: 'auto', 
          px: { xs: 1, sm: 2 }, 
          minHeight: 60,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Menu Hamburger (mobile) */}
        <Box sx={{ 
          display: { xs: session?.user ? 'flex' : 'none', md: 'none' },
          alignItems: 'center',
          mr: 1
        }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ color: '#444' }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        
        {/* Logo */}
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            flexGrow: session?.user ? 0 : 1,
            justifyContent: session?.user ? 'flex-start' : { xs: 'flex-start', md: 'flex-start' },
            ml: 0
          }} 
          onClick={() => router.push('/')}
        >
          <Box sx={{ 
            width: { xs: 100, sm: 120, md: 140 },
            height: 'auto',
            position: 'relative',
            '& img': {
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              display: 'block'
            }
          }}>
            <img 
              src="/images/logo.png" 
              alt="Flashcards App" 
            />
          </Box>
        </Box>
        {/* Menu centralizado (desktop) */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          flexGrow: 1, 
          justifyContent: 'center', 
          gap: 2.5,
          mx: 2
        }}>
          {session && session.user && navItems.map((item) => {
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
                  background: isActive ? 'rgba(25, 118, 210, 0.08)' : 'none',
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
                    background: 'rgba(25, 118, 210, 0.13)',
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
        {/* Botão Login/Logout */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'flex-end',
          minWidth: { xs: 80, sm: 100 },
          ml: { xs: 1, sm: 2 }
        }}>
          {session && session.user ? (
            <Button
              onClick={() => signOut({ callbackUrl: '/login' })}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: 14, sm: 16 },
                border: '2px solid #1976d2',
                color: '#1976d2',
                background: 'none',
                px: { xs: 1.5, sm: 2, md: 3 },
                py: { xs: 0.5, sm: 0.75 },
                minWidth: { xs: 70, sm: 90, md: 100 },
                fontFamily: 'Montserrat, Arial, sans-serif',
                letterSpacing: 0.5,
                boxShadow: 'none',
                whiteSpace: 'nowrap',
                '&:hover': {
                  background: '#e3f2fd',
                  color: '#1976d2',
                  border: '2.5px solid #1976d2',
                },
              }}
            >
              {isMobile ? 'Sair' : 'Sair'}
            </Button>
          ) : (
            <Button
              component={Link}
              href="/login"
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: { xs: 14, sm: 16 },
                border: '2px solid #1976d2',
                color: '#1976d2',
                background: 'none',
                px: { xs: 1.5, sm: 2, md: 3 },
                py: { xs: 0.5, sm: 0.75 },
                minWidth: { xs: 70, sm: 90, md: 100 },
                fontFamily: 'Montserrat, Arial, sans-serif',
                letterSpacing: 0.5,
                boxShadow: 'none',
                whiteSpace: 'nowrap',
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
        </Box>
        
        {/* Drawer para mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Melhor performance em mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box',
              width: 250,
              borderRight: '1px solid #e0e0e0',
              boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
            },
          }}
        >
          {drawer}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;