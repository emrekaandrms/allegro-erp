import React, { useState } from 'react';
import { login } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { TextField, Button, Container, Typography } from '@mui/material';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setToken, setRole} = useAuth();

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      const {token, role} = await login(email, password);
      setToken(token);
      setRole(role);
      window.location.href='/';
    } catch(err) {
      alert('Login failed');
    }
  }

  return (
    <Container style={{marginTop:'100px', maxWidth:'400px'}}>
      <Typography variant="h5" gutterBottom>Giriş Yap</Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
        <TextField fullWidth margin="normal" label="Şifre" type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
        <Button fullWidth type="submit" variant="contained">Giriş</Button>
      </form>
    </Container>
  )
}
