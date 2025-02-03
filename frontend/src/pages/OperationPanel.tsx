import React, {useEffect,useState} from 'react';
import { listProducts, setPhotoRequired, deleteProduct, updateProduct } from '../services/productService';
import { ProductTable } from '../components/ProductTable';
import { useAuth } from '../hooks/useAuth';
import { Button, Box, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { NewProductForm } from '../components/Forms/NewProductForm';
import { Product } from '../types/types';

export function OperationPanel() {
  const {token} = useAuth();
  const [products,setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const load = async() => {
    if(!token) return;
    try {
      const data = await listProducts(token);
      setProducts(data);
    } catch (error) {
      console.error('Ürünler yüklenirken hata oluştu:', error);
    }
  }

  useEffect(()=>{
    load();
  },[token]);

  const handleExport = () => {
    window.location.href=`${process.env.REACT_APP_API_URL}/products/export`;
  }

  const handleSetPhoto = async () => {
    if(!token) return;
    try {
      await setPhotoRequired(token, selectedIds);
      await load();
    } catch (error) {
      console.error('Fotoğraf durumu güncellenirken hata oluştu:', error);
      alert('Fotoğraf durumu güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }

  const handleCreated = async() => {
    await load();
    setEditingProduct(null);
    setIsEditDialogOpen(false);
  }

  const handleDelete = async (id: number) => {
    if(!token) return;
    try {
      await deleteProduct(token, id);
      await load();
    } catch (error) {
      console.error('Ürün silinirken hata oluştu:', error);
      alert('Ürün silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }

  const handleEdit = (id: number) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setEditingProduct(product);
      setIsEditDialogOpen(true);
    }
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingProduct(null);
  }

  return (
    <div style={{padding:'20px', marginTop: '64px'}}>
      <h2>Operasyon Paneli</h2>
      <Box sx={{display:'flex', gap:2}}>
        <Button variant="outlined" onClick={handleExport}>CSV İndir</Button>
        <Button variant="contained" onClick={handleSetPhoto}>Seçili Ürünleri Fotoğrafa Gönder</Button>
      </Box>
      <h3>Yeni Ürün Ekle</h3>
      <NewProductForm onCreated={handleCreated}/>
      <h3>Tüm Ürünler</h3>
      <ProductTable 
        products={products} 
        selectable 
        onSelectionChange={setSelectedIds}
        onProductSelect={handleEdit}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog} maxWidth="md" fullWidth>
        <DialogTitle>Ürün Düzenle</DialogTitle>
        <DialogContent>
          <NewProductForm 
            onCreated={handleCreated} 
            editingProduct={editingProduct}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
