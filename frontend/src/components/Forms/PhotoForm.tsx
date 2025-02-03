import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { uploadPhoto } from '../../services/photoService';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  productId: number;
  onPhotoUploaded: () => void;
}

export function PhotoForm({ productId, onPhotoUploaded }: Props) {
  const { token } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedFile) return;

    try {
      setUploading(true);
      await uploadPhoto(token, productId, selectedFile);
      onPhotoUploaded();
      setSelectedFile(null);
    } catch (error) {
      console.error('Fotoğraf yüklenirken hata oluştu:', error);
      alert('Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setUploading(false);
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
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="photo-upload"
        type="file"
        onChange={handleFileSelect}
      />
      <label htmlFor="photo-upload">
        <Button
          variant="outlined"
          component="span"
          fullWidth
        >
          Fotoğraf Seç
        </Button>
      </label>
      
      {selectedFile && (
        <Typography variant="body2" color="text.secondary" align="center">
          Seçilen dosya: {selectedFile.name}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!selectedFile || uploading}
      >
        {uploading ? 'Yükleniyor...' : 'Fotoğrafı Yükle'}
      </Button>
    </Box>
  );
} 