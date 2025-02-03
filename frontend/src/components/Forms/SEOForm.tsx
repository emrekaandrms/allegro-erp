import React, { useState } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { createSEOInfo } from '../../services/seoService';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  productId: number;
  onSEOAdded: () => void;
}

export function SEOForm({ productId, onSEOAdded }: Props) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    platform: '',
    title: '',
    description: '',
    metaTitle: '',
    metaDescription: ''
  });

  const handleTextChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setFormData(prev => ({
      ...prev,
      platform: event.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      await createSEOInfo(token, {
        product_id: productId,
        platform: formData.platform,
        title: formData.title,
        description: formData.description,
        meta_title: formData.metaTitle,
        meta_description: formData.metaDescription
      });
      onSEOAdded();
      setFormData({
        platform: '',
        title: '',
        description: '',
        metaTitle: '',
        metaDescription: ''
      });
    } catch (error) {
      console.error('SEO bilgisi kaydedilirken hata oluştu:', error);
      alert('SEO bilgisi kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
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
      <FormControl required>
        <InputLabel>Platform</InputLabel>
        <Select
          value={formData.platform}
          label="Platform"
          onChange={handleSelectChange}
        >
          <MenuItem value="shopify">Shopify</MenuItem>
          <MenuItem value="etsy">Etsy</MenuItem>
          <MenuItem value="amazon">Amazon</MenuItem>
          <MenuItem value="hepsiburada">Hepsiburada</MenuItem>
          <MenuItem value="trendyol">Trendyol</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Başlık"
        value={formData.title}
        onChange={handleTextChange('title')}
        required
        multiline
        rows={2}
      />

      <TextField
        label="Açıklama"
        value={formData.description}
        onChange={handleTextChange('description')}
        required
        multiline
        rows={4}
      />

      <TextField
        label="Meta Başlık"
        value={formData.metaTitle}
        onChange={handleTextChange('metaTitle')}
        required
        multiline
        rows={2}
      />

      <TextField
        label="Meta Açıklama"
        value={formData.metaDescription}
        onChange={handleTextChange('metaDescription')}
        required
        multiline
        rows={4}
      />

      <Button type="submit" variant="contained" color="primary">
        SEO Bilgilerini Kaydet
      </Button>
    </Box>
  );
}
