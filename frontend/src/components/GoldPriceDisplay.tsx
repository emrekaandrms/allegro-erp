import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  goldPrice: number;
}

export function GoldPriceDisplay({ goldPrice }: Props) {
  return (
    <Box sx={{ 
      backgroundColor: '#f5f5f5', 
      padding: 2, 
      borderRadius: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Typography variant="subtitle2" color="textSecondary">
        Güncel Altın Fiyatı (TL/gr)
      </Typography>
      <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
        {goldPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
      </Typography>
      <Typography variant="caption" color="textSecondary">
        Son güncelleme: {new Date().toLocaleTimeString('tr-TR')}
      </Typography>
    </Box>
  );
} 