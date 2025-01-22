import React, {useState} from 'react';
import {TextField, Button, Box} from '@mui/material';
import { setSEO } from '../../services/seoService';
import { useAuth } from '../../hooks/useAuth';

export function SEOForm({productId,onCompleted}:{productId:number,onCompleted:()=>void}) {
  const {token} = useAuth();
  const platforms = ['shopify','etsy','trendyol','amazon','hepsiburada'];
  const [seoData, setSeoData] = useState(platforms.map(p=>({platform:p, title:'', description:'', meta_title:'', meta_description:''})));

  const handleChange = (i:number, field:string, value:string) => {
    const copy = [...seoData];
    (copy[i] as any)[field] = value;
    setSeoData(copy);
  }

  const handleSave = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!token) return;
    await setSEO(token, productId, seoData);
    onCompleted();
  }

  return (
    <Box component="form" onSubmit={handleSave} sx={{display:'flex', flexDirection:'column', gap:2}}>
      {seoData.map((item,i)=>(
        <Box key={i} sx={{border:'1px solid #ccc', padding:2}}>
          <h4>{item.platform.toUpperCase()}</h4>
          <TextField label="Title" value={item.title} onChange={e=>handleChange(i,'title',e.target.value)} fullWidth/>
          <TextField label="Description" value={item.description} onChange={e=>handleChange(i,'description',e.target.value)} fullWidth/>
          <TextField label="Meta Title" value={item.meta_title} onChange={e=>handleChange(i,'meta_title',e.target.value)} fullWidth/>
          <TextField label="Meta Description" value={item.meta_description} onChange={e=>handleChange(i,'meta_description',e.target.value)} fullWidth/>
        </Box>
      ))}
      <Button type="submit" variant="contained">Kaydet</Button>
    </Box>
  )
}
