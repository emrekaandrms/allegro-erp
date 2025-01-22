// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { OperationPanel } from './pages/OperationPanel';
import { PhotoPanel } from './pages/PhotoPanel';
import { FinancePanel } from './pages/FinancePanel';
import { SEOPanel } from './pages/SEOPanel';
import { AdminPanel } from './pages/AdminPanel';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import { Layout } from './Layout';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          
          {/* Burada PrivateRoute ile koruyup ardından Layout ile sarmalıyoruz */}
          <Route path="/" element={<PrivateRoute><Layout><OperationPanel/></Layout></PrivateRoute>}/>
          <Route path="/photo" element={<PrivateRoute><Layout><PhotoPanel/></Layout></PrivateRoute>}/>
          <Route path="/finance" element={<PrivateRoute><Layout><FinancePanel/></Layout></PrivateRoute>}/>
          <Route path="/seo" element={<PrivateRoute><Layout><SEOPanel/></Layout></PrivateRoute>}/>
          <Route path="/admin" element={<PrivateRoute><Layout><AdminPanel/></Layout></PrivateRoute>}/>

          <Route path="*" element={<Navigate to="/" />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
