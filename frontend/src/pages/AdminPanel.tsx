// AdminPanel.tsx
import React, {useEffect,useState} from 'react';
import { useAuth } from '../hooks/useAuth';
import { listParams, updateParam, listUsers, createUser, updateUserRole } from '../services/adminService';
import {TextField,Button,Box,Select,MenuItem} from '@mui/material';

export function AdminPanel() {
  const {token} = useAuth();
  const [params,setParams] = useState<any[]>([]);
  const [users,setUsers] = useState<any[]>([]);

  const [newUserEmail,setNewUserEmail] = useState('');
  const [newUserPassword,setNewUserPassword] = useState('');
  const [newUserRole,setNewUserRole] = useState('operasyon');

  const validRoles = ['operasyon','fotoğraf','muhasebe','seo','admin'];

  const loadParams = async() => {
    if(!token) return;
    const data = await listParams(token);
    setParams(data);
  }

  const loadUsers = async() => {
    if(!token) return;
    const data = await listUsers(token);
    setUsers(data);
  }

  useEffect(()=>{
    loadParams();
    loadUsers();
  },[token]);

  const handleUpdateParam = async (param_key:string,param_value:string) => {
    if(!token) return;
    await updateParam(token, param_key, param_value);
    await loadParams();
  }

  const handleCreateUser = async(e:React.FormEvent) => {
    e.preventDefault();
    if(!token) return;
    await createUser(token, newUserEmail, newUserPassword, newUserRole);
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserRole('operasyon');
    await loadUsers();
  }

  const handleUpdateUserRole = async (userId:number, role:string) => {
    if(!token) return;
    await updateUserRole(token,userId,role);
    await loadUsers();
  }

  return (
    <div style={{padding:'20px', marginTop: '64px'}}>
      <h2>Admin Paneli</h2>
      
      <h3>Sistem Parametreleri</h3>
      {params.map(p=>(
        <Box key={p.id} sx={{display:'flex',gap:2,mb:2}}>
          <TextField 
            label={p.param_key} 
            defaultValue={p.param_value} 
            onBlur={(e)=>handleUpdateParam(p.param_key,e.target.value)}
          />
        </Box>
      ))}

      <hr/>

      <h3>Kullanıcı Yönetimi</h3>
      <h4>Mevcut Kullanıcılar</h4>
      <table border={1} cellPadding={5} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Yeni Rol Seç</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u=>(
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <Select 
                  value={u.role} 
                  onChange={(e)=>handleUpdateUserRole(u.id, e.target.value as string)}
                >
                  {validRoles.map(r=><MenuItem key={r} value={r}>{r}</MenuItem>)}
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Yeni Kullanıcı Ekle</h4>
      <Box component="form" onSubmit={handleCreateUser} sx={{display:'flex',flexDirection:'column',gap:2,width:'300px'}}>
        <TextField 
          label="Email" 
          value={newUserEmail} 
          onChange={(e)=>setNewUserEmail(e.target.value)} 
          required
        />
        <TextField 
          label="Şifre" 
          value={newUserPassword} 
          onChange={(e)=>setNewUserPassword(e.target.value)} 
          required 
          type="password"
        />
        <Select value={newUserRole} onChange={(e)=>setNewUserRole(e.target.value as string)}>
          {validRoles.map(r=><MenuItem key={r} value={r}>{r}</MenuItem>)}
        </Select>
        <Button type="submit" variant="contained">Kullanıcı Oluştur</Button>
      </Box>
    </div>
  )
}
