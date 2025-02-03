import React, {useEffect,useState} from 'react';
import { listProducts } from '../services/productService';
import { useAuth } from '../hooks/useAuth';
import { ProductTable } from '../components/ProductTable';
import { PhotoForm } from '../components/Forms/PhotoForm';
import { Product } from '../types/types';

export function PhotoPanel() {
  const {token} = useAuth();
  const [products,setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number| null>(null);

  const load = async() => {
    if(!token) return;
    try {
      const data = await listProducts(token);
      setProducts(data.filter((p: Product) => p.status === 'foto_gerekli'));
    } catch (error) {
      console.error('Ürünler yüklenirken hata oluştu:', error);
    }
  }

  useEffect(()=>{load();},[token]);

  const handlePhotoUploaded = async() => {
    setSelectedProductId(null);
    await load();
  }

  return (
    <div style={{padding:'20px', marginTop: '64px'}}>
      <h2>Fotoğraf Paneli</h2>
      <p>Fotoğraf çekilmesi gereken ürünler:</p>
      <ProductTable products={products} onSelectionChange={(ids)=>setSelectedProductId(ids[0] || null)} onProductSelect={(id) => setSelectedProductId(id)}/>
      {selectedProductId && (
        <>
          <h3>{selectedProductId} ID'li ürüne fotoğraf yükle</h3>
          <PhotoForm productId={selectedProductId} onPhotoUploaded={handlePhotoUploaded}/>
        </>
      )}
    </div>
  )
}
