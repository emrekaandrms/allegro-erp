import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { createCost, getCost, updateCost } from '../../services/costService';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  productId: number;
  onCostAdded: () => void;
}

export function CostForm({ productId, onCostAdded }: Props) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    laborCost: '',
    shippingCost: '',
    shopifyCommission: '',
    etsyCommission: '',
    amazonCommission: '',
    hepsiburadaCommission: '',
    trendyolCommission: '',
    paymentCommission: ''
  });

  useEffect(() => {
    const loadExistingCost = async () => {
      if (!token) return;
      try {
        const cost = await getCost(token, productId);
        if (cost) {
          setFormData({
            laborCost: cost.labor_cost.toString(),
            shippingCost: cost.shipping_cost.toString(),
            shopifyCommission: cost.shopify_commission.toString(),
            etsyCommission: cost.etsy_commission.toString(),
            amazonCommission: cost.amazon_commission.toString(),
            hepsiburadaCommission: cost.hepsiburada_commission.toString(),
            trendyolCommission: cost.trendyol_commission.toString(),
            paymentCommission: cost.payment_commission.toString()
          });
        }
      } catch (error) {
        console.error('Maliyet bilgileri yüklenirken hata oluştu:', error);
      }
    };

    loadExistingCost();
  }, [productId, token]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const costData = {
        product_id: productId,
        labor_cost: Number(formData.laborCost),
        shipping_cost: Number(formData.shippingCost),
        shopify_commission: Number(formData.shopifyCommission),
        etsy_commission: Number(formData.etsyCommission),
        amazon_commission: Number(formData.amazonCommission),
        hepsiburada_commission: Number(formData.hepsiburadaCommission),
        trendyol_commission: Number(formData.trendyolCommission),
        payment_commission: Number(formData.paymentCommission)
      };

      await updateCost(token, productId, costData);
      onCostAdded();
    } catch (error) {
      console.error('Fiyat kaydedilirken hata oluştu:', error);
      alert('Fiyat kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: '500px',
        mx: 'auto',
        my: 2
      }}
    >
      <TextField
        label="İşçilik Maliyeti"
        value={formData.laborCost}
        onChange={handleChange('laborCost')}
        required
        type="number"
        inputProps={{ step: "0.01", min: "0" }}
      />
      <TextField
        label="Kargo Maliyeti"
        value={formData.shippingCost}
        onChange={handleChange('shippingCost')}
        required
        type="number"
        inputProps={{ step: "0.01", min: "0" }}
      />
      <TextField
        label="Shopify Komisyonu (%)"
        value={formData.shopifyCommission}
        onChange={handleChange('shopifyCommission')}
        required
        type="number"
        inputProps={{ step: "0.01", min: "0", max: "100" }}
      />
      <TextField
        label="Etsy Komisyonu (%)"
        value={formData.etsyCommission}
        onChange={handleChange('etsyCommission')}
        required
        type="number"
        inputProps={{ step: "0.01", min: "0", max: "100" }}
      />
      <TextField
        label="Amazon Komisyonu (%)"
        value={formData.amazonCommission}
        onChange={handleChange('amazonCommission')}
        required
        type="number"
        inputProps={{ step: "0.01", min: "0", max: "100" }}
      />
      <TextField
        label="Hepsiburada Komisyonu (%)"
        value={formData.hepsiburadaCommission}
        onChange={handleChange('hepsiburadaCommission')}
        required
        type="number"
        inputProps={{ step: "0.01", min: "0", max: "100" }}
      />
      <TextField
        label="Trendyol Komisyonu (%)"
        value={formData.trendyolCommission}
        onChange={handleChange('trendyolCommission')}
        required
        type="number"
        inputProps={{ step: "0.01", min: "0", max: "100" }}
      />
      <TextField
        label="Ödeme Komisyonu (%)"
        value={formData.paymentCommission}
        onChange={handleChange('paymentCommission')}
        required
        type="number"
        inputProps={{ step: "0.01", min: "0", max: "100" }}
      />
      <Button type="submit" variant="contained" color="primary">
        Fiyat Bilgilerini Güncelle
      </Button>
    </Box>
  );
} 