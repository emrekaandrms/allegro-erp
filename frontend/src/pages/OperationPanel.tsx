import React, {useEffect,useState} from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { listProducts, setPhotoRequired } from '../services/productService';
import { ProductTable } from '../components/ProductTable';
import { useAuth } from '../hooks/useAuth';
import { Button, Box } from '@mui/material';
import { NewProductForm } from '../components/Forms/NewProductForm';

export function OperationPanel() {
  const {token} = useAuth();
  const [products,setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const load = async() => {
    if(!token) return;
    const data = await listProducts(token);
    setProducts(data);
  }

  useEffect(()=>{
    load();
  },[token]);

  const handleExport = () => {
    window.location.href=`${process.env.REACT_APP_API_URL}/products/export`;
  }

  const handleSetPhoto = async () => {
    if(!token) return;
    await setPhotoRequired(token, selectedIds);
    await load();
  }

  const handleCreated = async() => {
    await load();
  }

  return (
    <div style={{display:'flex'}}>
      <Sidebar/>
      <div style={{flex:1, padding:'20px'}}>
        <Header/>
        <h2>Operasyon Paneli</h2>
        <Box sx={{display:'flex', gap:2}}>
          <Button variant="outlined" onClick={handleExport}>CSV İndir</Button>
          <Button variant="contained" onClick={handleSetPhoto}>Seçili Ürünleri Fotoğrafa Gönder</Button>
        </Box>
        <h3>Yeni Ürün Ekle</h3>
        <NewProductForm onCreated={handleCreated}/>
        <h3>Tüm Ürünler</h3>
        <ProductTable products={products} selectable onSelectionChange={setSelectedIds}/>
      </div>
    </div>
  )
}
