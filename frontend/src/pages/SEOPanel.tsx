import React, {useEffect,useState} from 'react';
import { useAuth } from '../hooks/useAuth';
import { listProducts } from '../services/productService';
import { ProductTable } from '../components/ProductTable';
import { SEOForm } from '../components/Forms/SEOForm';
import { Product } from '../types/types';

export function SEOPanel() {
  const {token} = useAuth();
  const [products,setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<number|null>(null);

  const load = async() => {
    if(!token) return;
    try {
      const data = await listProducts(token);
      setProducts(data.filter((p: Product) => p.status === 'seo_gerekli'));
    } catch (error) {
      console.error('Ürünler yüklenirken hata oluştu:', error);
    }
  }

  useEffect(()=>{load();},[token]);

  const handleSEOAdded = async() => {
    setSelectedId(null);
    await load();
  }

  return (
    <div style={{padding:'20px', marginTop: '64px'}}>
      <h2>SEO Paneli</h2>
      <p>SEO bilgisi girilmemiş ürünler:</p>
      <ProductTable products={products} onSelectionChange={(ids)=>setSelectedId(ids[0]||null)} onProductSelect={(id) => setSelectedId(id)}/>
      {selectedId && (
        <>
          <h3>{selectedId} ID'li ürüne SEO Bilgileri</h3>
          <SEOForm productId={selectedId} onSEOAdded={handleSEOAdded}/>
        </>
      )}
    </div>
  )
}
