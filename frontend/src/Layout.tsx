// frontend/src/Layout.tsx
import React, { useState } from 'react';
import { Container } from '@mui/material';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <Header isMenuOpen={isMenuOpen} onMenuClick={() => setIsMenuOpen(!isMenuOpen)} />
      <Sidebar open={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
        {children}
      </Container>
    </div>
  );
}
