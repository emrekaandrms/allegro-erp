import React, {useEffect,useState} from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { listSEONeeded } from '../services/seoService';
import { ProductTable } from '../components/ProductTable';
import { SEOForm } from '../components/Forms/SEOForm';

export function SEOPanel() {
  const {token} = useAuth();
  const [products,setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState<number|null>(null);

  const load = async() => {
    if(!token) return;
    const data = await listSEONeeded(token);
    setProducts(data);
  }

  useEffect(()=>{load();},[token]);

  const handleCompleted = async() => {
    setSelectedId(null);
    await load();
  }

  return (
    <div style={{display:'flex'}}>
      <Sidebar/>
      <div style={{flex:1, padding:'20px'}}>
        <Header/>
        <h2>SEO Paneli</h2>
        <p>SEO bilgisi girilmemiş ürünler:</p>
        <ProductTable products={products} onSelectionChange={(ids)=>setSelectedId(ids[0]||null)}/>
        {selectedId && (
          <>
            <h3>{selectedId} ID'li ürüne SEO Bilgileri</h3>
            <SEOForm productId={selectedId} onCompleted={handleCompleted}/>
          </>
        )}
      </div>
    </div>
  )
}
