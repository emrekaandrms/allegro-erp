import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../hooks/useAuth';
import { styled } from '@mui/material/styles';

const MenuIconButton = styled(IconButton)`
  transition: transform 0.3s;
  &.open {
    transform: rotate(90deg);
  }
`;

interface HeaderProps {
  isMenuOpen: boolean;
  onMenuClick: () => void;
}

export function Header({ isMenuOpen, onMenuClick }: HeaderProps) {
  const {role,setToken,setRole} = useAuth();

  const handleLogout = () => {
    setToken('');
    setRole('');
    window.location.href='/login';
  }

  return (
    <AppBar position="fixed">
      <Toolbar>
        <MenuIconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          className={isMenuOpen ? 'open' : ''}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </MenuIconButton>
        <Typography variant="h6" sx={{ flex: 1 }}>Ürün Yönetim Sistemi</Typography>
        <Typography variant="body1" sx={{ mr: 2 }}>Rol: {role}</Typography>
        <Button color="inherit" onClick={handleLogout}>Çıkış</Button>
      </Toolbar>
    </AppBar>
  );
}
