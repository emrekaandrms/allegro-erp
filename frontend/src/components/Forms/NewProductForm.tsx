import React, {useState, useEffect} from 'react';
import {
  TextField, Button, Box, Select, MenuItem, FormControl, 
  InputLabel, FormGroup, FormControlLabel, Checkbox, 
  Typography, Grid, Divider
} from '@mui/material';
import { createProduct, updateProduct } from '../../services/productService';
import { useAuth } from '../../hooks/useAuth';
import { Product } from '../../types/types';

const KARAT_OPTIONS = [
  { value: '10K', label: '10K' },
  { value: '14K', label: '14K' },
  { value: '18K', label: '18K' }
];

const COLOR_OPTIONS = [
  { value: 'S', label: 'Sarı' },
  { value: 'B', label: 'Beyaz' },
  { value: 'R', label: 'Rose' }
];

const PRODUCT_TYPES = [
  { value: 'Yüzük', label: 'Yüzük' },
  { value: 'Kolye', label: 'Kolye' },
  { value: 'Küpe', label: 'Küpe' },
  { value: 'Bileklik', label: 'Bileklik' },
  { value: 'Zincir', label: 'Zincir' },
  { value: 'Kolye Ucu', label: 'Kolye Ucu' }
];

const LENGTH_OPTIONS = {
  'Kolye': ['16"', '18"', '20"', '22"', '24"'],
  'Bileklik': ['6"', '7"', '8"', '9"', '10"'],
  'Zincir': ['6"', '7"', '8"', '9"', '10"', '16"', '18"', '20"', '22"', '24"']
};

interface WeightByKarat {
  karat: string;
  weight: string;
}

interface WeightByLength {
  length: string;
  weight: string;
}

interface Props {
  onCreated: () => void;
  editingProduct?: Product | null;
}

export function NewProductForm({onCreated, editingProduct}: Props) {
  const {token} = useAuth();
  const [sku,setSku] = useState(editingProduct?.sku || '');
  const [selectedKarats, setSelectedKarats] = useState<string[]>(
    editingProduct?.karat ? [editingProduct.karat] : ['14K']
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    editingProduct?.color ? [editingProduct.color] : []
  );
  const [type,setType] = useState(editingProduct?.type || '');
  const [weightsByKarat, setWeightsByKarat] = useState<WeightByKarat[]>(
    editingProduct ? [{ karat: editingProduct.karat, weight: editingProduct.weight.toString() }] : []
  );
  const [selectedLengths, setSelectedLengths] = useState<string[]>(
    editingProduct?.length ? [editingProduct.length] : []
  );
  const [weightsByLength, setWeightsByLength] = useState<WeightByLength[]>(
    editingProduct?.length ? [{ length: editingProduct.length, weight: editingProduct.weight.toString() }] : []
  );
  const [thickness,setThickness] = useState(editingProduct?.thickness?.toString() || '');
  const [width,setWidth] = useState(editingProduct?.width?.toString() || '');

  // Ürün tipi değiştiğinde uzunluk seçeneklerini sıfırla
  useEffect(() => {
    setSelectedLengths([]);
    setWeightsByLength([]);
  }, [type]);

  // Karat seçimi değiştiğinde ağırlık listesini güncelle
  useEffect(() => {
    const newWeights = selectedKarats.map(karat => ({
      karat,
      weight: weightsByKarat.find(w => w.karat === karat)?.weight || ''
    }));
    setWeightsByKarat(newWeights);
  }, [selectedKarats]);

  // Uzunluk seçimi değiştiğinde ağırlık listesini güncelle
  useEffect(() => {
    const newWeights = selectedLengths.map(length => ({
      length,
      weight: weightsByLength.find(w => w.length === length)?.weight || ''
    }));
    setWeightsByLength(newWeights);
  }, [selectedLengths]);

  const handleKaratChange = (karat: string) => {
    setSelectedKarats(prev => 
      prev.includes(karat) 
        ? prev.filter(k => k !== karat)
        : [...prev, karat]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleLengthChange = (length: string) => {
    setSelectedLengths(prev =>
      prev.includes(length)
        ? prev.filter(l => l !== length)
        : [...prev, length]
    );
  };

  const handleWeightByKaratChange = (karat: string, weight: string) => {
    setWeightsByKarat(prev => 
      prev.map(w => w.karat === karat ? {...w, weight} : w)
    );
  };

  const handleWeightByLengthChange = (length: string, weight: string) => {
    setWeightsByLength(prev => 
      prev.map(w => w.length === length ? {...w, weight} : w)
    );
  };

  const generateSKUID = (baseSku: string, color: string, karat: string, length?: string) => {
    const parts = [baseSku, color, karat.replace('K','')];
    if (length) parts.push(length.replace('"',''));
    return parts.join('-');
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if(!token || selectedColors.length === 0 || selectedKarats.length === 0) return;

    const needsLength = ['Kolye', 'Bileklik', 'Zincir'].includes(type);
    
    try {
      if (editingProduct) {
        // Düzenleme işlemi
        const data = {
          sku,
          karat: selectedKarats[0],
          color: selectedColors[0],
          type,
          weight: needsLength 
            ? Number(weightsByLength[0]?.weight || 0)
            : Number(weightsByKarat[0]?.weight || 0),
          thickness: Number(thickness),
          width: Number(width),
          length: needsLength ? selectedLengths[0] : ''
        };
        await updateProduct(token, editingProduct.id, data);
      } else {
        // Yeni ürün ekleme işlemi
        for(const karat of selectedKarats) {
          for(const color of selectedColors) {
            if (needsLength && selectedLengths.length > 0) {
              for(const length of selectedLengths) {
                const lengthWeight = weightsByLength.find(w => w.length === length)?.weight;
                const skuId = generateSKUID(sku, color, karat, length);
                
                await createProduct(token, {
                  sku: skuId,
                  karat,
                  color,
                  type,
                  weight: Number(lengthWeight || 0),
                  thickness: Number(thickness),
                  width: Number(width),
                  length: length
                });
              }
            } else {
              const karatWeight = weightsByKarat.find(w => w.karat === karat)?.weight;
              const skuId = generateSKUID(sku, color, karat);
              
              await createProduct(token, {
                sku: skuId,
                karat,
                color,
                type,
                weight: Number(karatWeight || 0),
                thickness: Number(thickness),
                width: Number(width),
                length: ''
              });
            }
          }
        }
      }

      onCreated();
      // Form alanlarını temizle
      setSku('');
      setSelectedKarats(['14K']);
      setSelectedColors([]);
      setType('');
      setWeightsByKarat([]);
      setSelectedLengths([]);
      setWeightsByLength([]);
      setThickness('');
      setWidth('');
    } catch (error) {
      console.error('Ürün işlemi sırasında hata oluştu:', error);
      alert('İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  }

  const showLengthOptions = ['Kolye', 'Bileklik', 'Zincir'].includes(type);

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit} 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: '800px',
        mx: 'auto'
      }}
    >
      <TextField 
        label="SKU" 
        value={sku} 
        onChange={e=>setSku(e.target.value)} 
        required
        helperText="Temel SKU kodunu girin"
      />
      
      <FormControl required>
        <InputLabel>Ürün Tipi</InputLabel>
        <Select
          value={type}
          label="Ürün Tipi"
          onChange={e=>setType(e.target.value)}
        >
          {PRODUCT_TYPES.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl required component="fieldset">
        <Typography variant="subtitle2" gutterBottom>Renk Seçimi (En az bir tane seçilmeli)</Typography>
        <FormGroup row>
          {COLOR_OPTIONS.map(option => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={selectedColors.includes(option.value)}
                  onChange={() => handleColorChange(option.value)}
                />
              }
              label={option.label}
            />
          ))}
        </FormGroup>
      </FormControl>

      <Divider />

      {!showLengthOptions && (
        <>
          <Typography variant="subtitle1" gutterBottom>Karat ve Ağırlık Bilgileri</Typography>
          <FormControl required component="fieldset">
            <Grid container spacing={2}>
              {KARAT_OPTIONS.map(option => (
                <Grid item xs={12} key={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedKarats.includes(option.value)}
                          onChange={() => handleKaratChange(option.value)}
                        />
                      }
                      label={option.label}
                    />
                    {selectedKarats.includes(option.value) && (
                      <TextField
                        label="Ağırlık (gr)"
                        type="number"
                        value={weightsByKarat.find(w => w.karat === option.value)?.weight || ''}
                        onChange={(e) => handleWeightByKaratChange(option.value, e.target.value)}
                        required
                        size="small"
                      />
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </FormControl>
        </>
      )}

      {showLengthOptions && (
        <>
          <Typography variant="subtitle1" gutterBottom>Karat Seçimi</Typography>
          <FormControl required component="fieldset">
            <FormGroup row>
              {KARAT_OPTIONS.map(option => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={selectedKarats.includes(option.value)}
                      onChange={() => handleKaratChange(option.value)}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
          </FormControl>

          <Divider />
          
          <Typography variant="subtitle1" gutterBottom>Uzunluk ve Ağırlık Bilgileri</Typography>
          <FormControl required component="fieldset">
            <Grid container spacing={2}>
              {LENGTH_OPTIONS[type as keyof typeof LENGTH_OPTIONS]?.map(length => (
                <Grid item xs={12} key={length}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedLengths.includes(length)}
                          onChange={() => handleLengthChange(length)}
                        />
                      }
                      label={length}
                    />
                    {selectedLengths.includes(length) && (
                      <TextField
                        label="Ağırlık (gr)"
                        type="number"
                        value={weightsByLength.find(w => w.length === length)?.weight || ''}
                        onChange={(e) => handleWeightByLengthChange(length, e.target.value)}
                        required
                        size="small"
                      />
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </FormControl>
        </>
      )}

      <Divider />

      <Typography variant="subtitle1" gutterBottom>Diğer Ölçüler</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField 
            label="Kalınlık (mm)" 
            value={thickness} 
            onChange={e=>setThickness(e.target.value)} 
            required 
            type="number"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField 
            label="Genişlik (mm)" 
            value={width} 
            onChange={e=>setWidth(e.target.value)} 
            required 
            type="number"
            fullWidth
          />
        </Grid>
      </Grid>

      {sku && selectedColors.length > 0 && selectedKarats.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Oluşturulacak SKUID'ler:
          </Typography>
          <Box sx={{ ml: 2 }}>
            {selectedKarats.map(karat => 
              selectedColors.map(color => {
                if (showLengthOptions && selectedLengths.length > 0) {
                  return selectedLengths.map(length => (
                    <Typography key={`${sku}-${color}-${karat}-${length}`} variant="body2">
                      {generateSKUID(sku, color, karat, length)}
                    </Typography>
                  ));
                }
                return (
                  <Typography key={`${sku}-${color}-${karat}`} variant="body2">
                    {generateSKUID(sku, color, karat)}
                  </Typography>
                );
              })
            )}
          </Box>
        </Box>
      )}

      <Button 
        type="submit" 
        variant="contained"
        disabled={selectedColors.length === 0 || selectedKarats.length === 0}
        sx={{ mt: 2 }}
      >
        Ürün Ekle
      </Button>
    </Box>
  );
}
