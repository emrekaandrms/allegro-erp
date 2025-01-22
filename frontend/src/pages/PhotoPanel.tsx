import React, {useEffect,useState} from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { listPendingPhotos } from '../services/photoService';
import { useAuth } from '../hooks/useAuth';
import { ProductTable } from '../components/ProductTable';
import { PhotoUploadForm } from '../components/Forms/PhotoUploadForm';

export function PhotoPanel() {
  const {token} = useAuth();
  const [products,setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState<number| null>(null);

  const load = async() => {
    if(!token) return;
    const data = await listPendingPhotos(token);
    setProducts(data);
  }

  useEffect(()=>{load();},[token]);

  const handleUploaded = async() => {
    setSelectedProductId(null);
    await load();
  }

  return (
    <div style={{display:'flex'}}>
      <Sidebar/>
      <div style={{flex:1, padding:'20px'}}>
        <Header/>
        <h2>Fotoğraf Paneli</h2>
        <p>Fotoğraf çekilmesi gereken ürünler:</p>
        <ProductTable products={products} onSelectionChange={(ids)=>setSelectedProductId(ids[0] || null)}/>
        {selectedProductId && (
          <>
            <h3>{selectedProductId} ID'li ürüne fotoğraf yükle</h3>
            <PhotoUploadForm productId={selectedProductId} onUploaded={handleUploaded}/>
          </>
        )}
      </div>
    </div>
  )
}
