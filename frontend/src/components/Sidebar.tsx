import React from 'react';
import { List, ListItem, ListItemText, Drawer } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const {role} = useAuth();

  const links = [
    {to:'/', text:'Operasyon Paneli', roles:['operasyon','admin']},
    {to:'/photo', text:'Fotoğraf Paneli', roles:['fotoğraf','admin']},
    {to:'/finance', text:'Muhasebe Paneli', roles:['muhasebe','admin']},
    {to:'/seo', text:'SEO Paneli', roles:['seo','admin']},
    {to:'/admin', text:'Admin Paneli', roles:['admin']}
  ];

  return (
    <Drawer 
      variant="temporary" 
      anchor="left" 
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: '240px',
          marginTop: '64px',
          transition: 'width 0.3s ease-in-out'
        }
      }}
    >
      <List>
        {links.map(l=> l.roles.includes(role||'') && (
          <ListItem button component={Link} to={l.to} key={l.text} onClick={onClose}>
            <ListItemText primary={l.text}/>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
