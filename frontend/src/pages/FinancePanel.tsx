import React, {useEffect,useState} from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { listPriceNeeded } from '../services/costService';
import { ProductTable } from '../components/ProductTable';
import { useAuth } from '../hooks/useAuth';
import { PriceForm } from '../components/Forms/PriceForm';

export function FinancePanel() {
  const {token} = useAuth();
  const [products,setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState<number|null>(null);

  const load = async() => {
    if(!token) return;
    const data = await listPriceNeeded(token);
    setProducts(data);
  }

  useEffect(()=>{load();},[token]);

  const handlePriced = async() => {
    setSelectedId(null);
    await load();
  }

  return (
    <div style={{display:'flex'}}>
      <Sidebar/>
      <div style={{flex:1, padding:'20px'}}>
        <Header/>
        <h2>Muhasebe Paneli</h2>
        <p>Fiyatı henüz belirlenmemiş ürünler:</p>
        <ProductTable products={products} onSelectionChange={(ids)=>setSelectedId(ids[0]||null)}/>
        {selectedId && (
          <>
            <h3>{selectedId} ID'li ürüne fiyat belirle</h3>
            <PriceForm productId={selectedId} onPriced={handlePriced}/>
          </>
        )}
      </div>
    </div>
  )
}
