// frontend/src/Layout.tsx
import React from 'react';
import { useAuth } from './hooks/useAuth';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { role } = useAuth();
  return (
    <div style={{ display: 'flex' }}>
      {role === 'admin' && <Sidebar />}
      <div style={{ flex: 1, padding: '20px' }}>
        <Header />
        {children}
      </div>
    </div>
  );
}
