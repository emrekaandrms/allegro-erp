import React from 'react';
import { List, ListItem, ListItemText, Drawer } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export function Sidebar() {
  const {role} = useAuth();

  const links = [
    {to:'/', text:'Operasyon Paneli', roles:['operasyon','admin']},
    {to:'/photo', text:'Fotoğraf Paneli', roles:['fotoğraf','admin']},
    {to:'/finance', text:'Muhasebe Paneli', roles:['muhasebe','admin']},
    {to:'/seo', text:'SEO Paneli', roles:['seo','admin']},
    {to:'/admin', text:'Admin Paneli', roles:['admin']}
  ];

  return (
    <Drawer variant="permanent" anchor="left">
      <List style={{width:'200px'}}>
        {links.map(l=> l.roles.includes(role||'') && (
          <ListItem button component={Link} to={l.to} key={l.text}>
            <ListItemText primary={l.text}/>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
