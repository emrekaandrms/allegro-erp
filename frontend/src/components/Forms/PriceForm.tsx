import React from 'react';
import { Button } from '@mui/material';
import { setPrice } from '../../services/costService';
import { useAuth } from '../../hooks/useAuth';

export function PriceForm({productId,onPriced}:{productId:number,onPriced:()=>void}) {
  const {token} = useAuth();

  const handlePrice = async () => {
    if(!token) return;
    await setPrice(token, productId);
    onPriced();
  }

  return (
    <Button variant="contained" onClick={handlePrice}>Fiyat Belirle</Button>
  )
}
