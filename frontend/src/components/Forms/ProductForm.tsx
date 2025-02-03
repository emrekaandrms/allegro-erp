import React, { useState } from 'react';
import { TextField, Button, Box, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { createProduct } from '../../services/productService';
import { useAuth } from '../../hooks/useAuth';

const KARAT_OPTIONS = [
  { value: '10K', label: '10K' },
  { value: '14K', label: '14K' },
  { value: '18K', label: '18K' },
];

const PRODUCT_TYPES = [
  { value: 'Yüzük', label: 'Yüzük' },
  { value: 'Kolye', label: 'Kolye' },
  { value: 'Küpe', label: 'Küpe' },
  { value: 'Bileklik', label: 'Bileklik' },
  { value: 'Zincir', label: 'Zincir' },
  { value: 'Kolye Ucu', label: 'Kolye Ucu' },
];

export function ProductForm({ onProductAdded }: { onProductAdded: () => void }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    sku: '',
    karat: '',
    type: '',
    weight: '',
    thickness: '',
    width: '',
    length: '',
  });

  const handleTextChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSelectChange = (field: string) => (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      await createProduct(token, {
        sku: formData.sku,
        karat: formData.karat,
        type: formData.type,
        weight: Number(formData.weight),
        thickness: Number(formData.thickness),
        width: Number(formData.width),
        length: Number(formData.length),
      });
      onProductAdded();
      setFormData({
        sku: '',
        karat: '',
        type: '',
        weight: '',
        thickness: '',
        width: '',
        length: '',
      });
    } catch (error) {
      console.error('Ürün eklenirken hata oluştu:', error);
      alert('Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
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
        label="SKU"
        value={formData.sku}
        onChange={handleTextChange('sku')}
        required
      />
      
      <FormControl required>
        <InputLabel>Karat</InputLabel>
        <Select
          value={formData.karat}
          label="Karat"
          onChange={handleSelectChange('karat')}
        >
          {KARAT_OPTIONS.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl required>
        <InputLabel>Ürün Tipi</InputLabel>
        <Select
          value={formData.type}
          label="Ürün Tipi"
          onChange={handleSelectChange('type')}
        >
          {PRODUCT_TYPES.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Ağırlık"
        value={formData.weight}
        onChange={handleTextChange('weight')}
        required
        type="number"
        inputProps={{ step: "0.01", min: "0" }}
      />
      <TextField
        label="Kalınlık"
        value={formData.thickness}
        onChange={handleTextChange('thickness')}
        required
        type="number"
        inputProps={{ step: "0.01", min: "0" }}
      />
      <TextField
        label="Genişlik"
        value={formData.width}
        onChange={handleTextChange('width')}
        required
        type="number"
        inputProps={{ step: "0.01", min: "0" }}
      />
      <TextField
        label="Uzunluk"
        value={formData.length}
        onChange={handleTextChange('length')}
        required
        type="number"
        inputProps={{ step: "0.01", min: "0" }}
      />
      <Button type="submit" variant="contained" color="primary">
        Ürün Ekle
      </Button>
    </Box>
  );
} 