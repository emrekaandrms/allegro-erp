import React, {useState} from 'react';
import {TextField, Button, Box} from '@mui/material';
import { createProduct } from '../../services/productService';
import { useAuth } from '../../hooks/useAuth';

export function NewProductForm({onCreated}:{onCreated:()=>void}) {
  const {token} = useAuth();
  const [sku,setSku] = useState('');
  const [weight,setWeight] = useState('');
  const [thickness,setThickness] = useState('');
  const [width,setWidth] = useState('');
  const [length,setLength] = useState('');

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!token) return;
    await createProduct(token,{sku,weight:Number(weight),thickness:Number(thickness),width:Number(width),length:Number(length)});
    onCreated();
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{display:'flex',flexDirection:'column',gap:2, width:'300px'}}>
      <TextField label="SKU" value={sku} onChange={e=>setSku(e.target.value)} required/>
      <TextField label="Ağırlık" value={weight} onChange={e=>setWeight(e.target.value)} required type="number"/>
      <TextField label="Kalınlık" value={thickness} onChange={e=>setThickness(e.target.value)} required type="number"/>
      <TextField label="Genişlik" value={width} onChange={e=>setWidth(e.target.value)} required type="number"/>
      <TextField label="Uzunluk" value={length} onChange={e=>setLength(e.target.value)} required type="number"/>
      <Button type="submit" variant="contained">Ürün Ekle</Button>
    </Box>
  )
}
