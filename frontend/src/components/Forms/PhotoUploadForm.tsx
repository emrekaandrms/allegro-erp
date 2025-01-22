import React, {useState} from 'react';
import {TextField, Button, Box} from '@mui/material';
import { uploadPhoto } from '../../services/photoService';
import { useAuth } from '../../hooks/useAuth';

export function PhotoUploadForm({productId, onUploaded}:{productId:number,onUploaded:()=>void}) {
  const {token} = useAuth();
  const [photoUrl, setPhotoUrl] = useState('');

  const handleUpload = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!token) return;
    await uploadPhoto(token, productId, photoUrl);
    onUploaded();
  }

  return (
    <Box component="form" onSubmit={handleUpload} sx={{display:'flex',gap:2}}>
      <TextField label="Fotoğraf URL" value={photoUrl} onChange={e=>setPhotoUrl(e.target.value)} required/>
      <Button type="submit" variant="contained">Yükle</Button>
    </Box>
  );
}
