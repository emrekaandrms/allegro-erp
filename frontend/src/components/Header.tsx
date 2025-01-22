import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const {role,setToken,setRole} = useAuth();

  const handleLogout = () => {
    setToken('');
    setRole('');
    window.location.href='/login';
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{flex:1}}>Ürün Yönetim Sistemi</Typography>
        <Typography variant="body1" style={{marginRight:'20px'}}>Rol: {role}</Typography>
        <Button color="inherit" onClick={handleLogout}>Çıkış</Button>
      </Toolbar>
    </AppBar>
  );
}
