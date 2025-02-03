import React, { useState, useEffect } from 'react';
import { Box, Button, Container } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { GoldPriceDisplay } from '../components/GoldPriceDisplay';
import { listProducts } from '../services/productService';
import { updateCost } from '../services/costService';
import { useAuth } from '../hooks/useAuth';
import { Product } from '../types/types';

export function FinancePanel() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [goldPrice, setGoldPrice] = useState(0);

  useEffect(() => {
    const fetchGoldPrice = async () => {
      try {
        // Sabit altın fiyatı kullan
        const price = 3174.58; // TL/gr
        setGoldPrice(price);
        console.log('Altın fiyatı ayarlandı:', price);
      } catch (error) {
        console.error('Altın fiyatı ayarlanırken hata oluştu:', error);
        setGoldPrice(0);
      }
    };

    // Her 5 dakikada bir fiyatı güncelle
    fetchGoldPrice();
    const interval = setInterval(fetchGoldPrice, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    if (!token) return;
    try {
      const data = await listProducts(token);
      
      // Her ürün için ilk hesaplamaları yap
      const productsWithCalculations = data.map((product: Product) => {
        if (!product.costs || product.costs.length === 0) {
          // Eğer cost yoksa varsayılan değerlerle oluştur
          const defaultCost = {
            product_id: product.id,
            gold_price_per_gram: goldPrice,
            labor_cost: 0,
            shipping_cost: 0,
            desired_profit_margin: 0,
            shopify_commission: 0,
            etsy_commission: 0,
            amazon_commission: 0,
            hepsiburada_commission: 0,
            trendyol_commission: 0,
            payment_commission: 0,
            gold_cost: 0,
            total_cost: 0,
            shopify_selling_price: 0,
            etsy_selling_price: 0,
            amazon_selling_price: 0,
            hepsiburada_selling_price: 0,
            trendyol_selling_price: 0
          };
          
          // Hesaplamaları yap
          const calculatedCost = calculatePrices(product, defaultCost);
          
          // Cost'u güncelle
          if (token) {
            updateCost(token, product.id, calculatedCost).catch(console.error);
          }
          
          // Ürüne hesaplanmış cost'u ekle
          product.costs = [calculatedCost];
        } else {
          // Varolan cost için hesaplamaları güncelle
          const calculatedCost = calculatePrices(product, product.costs[0]);
          
          // Cost'u güncelle
          if (token) {
            updateCost(token, product.id, calculatedCost).catch(console.error);
          }
          
          // Ürünün cost'unu güncelle
          product.costs[0] = calculatedCost;
        }
        return product;
      });

      setProducts(productsWithCalculations);
    } catch (error) {
      console.error('Ürünler yüklenirken hata oluştu:', error);
    }
  };

  useEffect(() => {
    load();
  }, [token]);

  const getKaratValue = (karat: string): number => {
    // Karat değerinden 'K' harfini kaldır ve sayıya çevir
    const karatNumber = parseInt(karat.replace('K', ''));
    switch (karatNumber) {
      case 10:
        return 0.375;
      case 14:
        return 0.585;
      case 18:
        return 0.750;
      default:
        console.warn(`Bilinmeyen karat değeri: ${karat}, varsayılan olarak 0 kullanılıyor`);
        return 0;
    }
  };

  const calculatePrices = (product: Product, cost: any) => {
    // Karat değerini al
    const karatValue = getKaratValue(product.karat);
    console.log('Karat değeri:', {
      karat: product.karat,
      karatValue: karatValue
    });

    // Altın maliyeti hesapla (Milyem hesabı: gram * altın fiyatı * karat değeri)
    const goldCost = product.weight * goldPrice * karatValue;
    console.log('Altın maliyet hesabı:', {
      weight: product.weight,
      goldPrice: goldPrice,
      karatValue: karatValue,
      goldCost: goldCost
    });

    // Toplam maliyet hesapla
    const totalCost = goldCost + cost.labor_cost + cost.shipping_cost;
    console.log('Toplam maliyet hesabı:', {
      goldCost: goldCost,
      laborCost: cost.labor_cost,
      shippingCost: cost.shipping_cost,
      totalCost: totalCost
    });

    // Her platform için satış fiyatı hesapla
    const calculateSellingPrice = (commission: number) => {
      const commissionAmount = totalCost * (commission / 100);
      const paymentCommissionAmount = totalCost * (cost.payment_commission / 100);
      const profitAmount = totalCost * (cost.desired_profit_margin / 100);
      return totalCost + commissionAmount + paymentCommissionAmount + profitAmount;
    };

    const result = {
      ...cost,
      gold_cost: goldCost,
      total_cost: totalCost,
      shopify_selling_price: calculateSellingPrice(cost.shopify_commission),
      etsy_selling_price: calculateSellingPrice(cost.etsy_commission),
      amazon_selling_price: calculateSellingPrice(cost.amazon_commission),
      hepsiburada_selling_price: calculateSellingPrice(cost.hepsiburada_commission),
      trendyol_selling_price: calculateSellingPrice(cost.trendyol_commission)
    };

    console.log('Hesaplanan sonuç:', result);
    return result;
  };

  const handleCostUpdate = async (productId: number, field: string, value: number) => {
    if (!token) return;
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      console.log('Ürün bilgileri:', {
        id: product.id,
        sku: product.sku,
        karat: product.karat,
        weight: product.weight,
        currentGoldPrice: goldPrice
      });

      const currentCost = product.costs?.[0] || {
        product_id: productId,
        gold_price_per_gram: goldPrice,
        labor_cost: 0,
        shipping_cost: 0,
        desired_profit_margin: 0,
        shopify_commission: 0,
        etsy_commission: 0,
        amazon_commission: 0,
        hepsiburada_commission: 0,
        trendyol_commission: 0,
        payment_commission: 0,
        gold_cost: 0,
        total_cost: 0,
        shopify_selling_price: 0,
        etsy_selling_price: 0,
        amazon_selling_price: 0,
        hepsiburada_selling_price: 0,
        trendyol_selling_price: 0
      };

      const updatedCost = {
        ...currentCost,
        gold_price_per_gram: goldPrice,
        [field]: value
      };

      // Fiyatları hesapla
      const calculatedCost = calculatePrices(product, updatedCost);

      console.log('Güncellenecek veri:', {
        productId,
        field,
        value,
        currentCost,
        calculatedCost,
        goldPrice
      });

      await updateCost(token, productId, calculatedCost);
      await load();
    } catch (error) {
      console.error('Maliyet güncellenirken hata oluştu:', error);
      if (error instanceof Error) {
        alert(`Maliyet güncellenirken hata oluştu: ${error.message}`);
      } else {
        alert('Maliyet güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'sku', headerName: 'SKU', width: 130 },
    { 
      field: 'karat', 
      headerName: 'Karat', 
      width: 100,
      editable: true,
      type: 'singleSelect',
      valueOptions: [
        { value: '10K', label: '10K' },
        { value: '14K', label: '14K' },
        { value: '18K', label: '18K' }
      ],
      valueGetter: (params: GridValueGetterParams) => {
        return params.row.karat || '14K'; // Varsayılan olarak 14K
      }
    },
    { field: 'weight', headerName: 'Ağırlık (gr)', width: 100 },
    {
      field: 'gold_cost',
      headerName: 'Altın Maliyeti',
      width: 130,
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        const goldCost = cost?.gold_cost;
        return typeof goldCost === 'number' ? Number(goldCost.toFixed(2)) : 0;
      }
    },
    {
      field: 'labor_cost',
      headerName: 'İşçilik Maliyeti',
      width: 130,
      editable: true,
      type: 'number',
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        return cost?.labor_cost ?? 0;
      },
      valueParser: (value: string) => Number(value)
    },
    {
      field: 'shipping_cost',
      headerName: 'Kargo Maliyeti',
      width: 130,
      editable: true,
      type: 'number',
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        return cost?.shipping_cost ?? 0;
      },
      valueParser: (value: string) => Number(value)
    },
    {
      field: 'total_cost',
      headerName: 'Toplam Maliyet',
      width: 130,
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        const totalCost = cost?.total_cost;
        return typeof totalCost === 'number' ? Number(totalCost.toFixed(2)) : 0;
      }
    },
    {
      field: 'desired_profit_margin',
      headerName: 'Kar Oranı (%)',
      width: 130,
      editable: true,
      type: 'number',
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        return cost?.desired_profit_margin ?? 0;
      },
      valueParser: (value: string) => Number(value)
    },
    {
      field: 'shopify_commission',
      headerName: 'Shopify Komisyonu (%)',
      width: 130,
      editable: true,
      type: 'number',
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        return cost?.shopify_commission ?? 0;
      },
      valueParser: (value: string) => Number(value)
    },
    {
      field: 'shopify_selling_price',
      headerName: 'Shopify Satış Fiyatı',
      width: 130,
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        const price = cost?.shopify_selling_price;
        return typeof price === 'number' ? Number(price.toFixed(2)) : 0;
      }
    },
    {
      field: 'etsy_commission',
      headerName: 'Etsy Komisyonu (%)',
      width: 130,
      editable: true,
      type: 'number',
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        return cost?.etsy_commission ?? 0;
      },
      valueParser: (value: string) => Number(value)
    },
    {
      field: 'etsy_selling_price',
      headerName: 'Etsy Satış Fiyatı',
      width: 130,
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        const price = cost?.etsy_selling_price;
        return typeof price === 'number' ? Number(price.toFixed(2)) : 0;
      }
    },
    {
      field: 'amazon_commission',
      headerName: 'Amazon Komisyonu (%)',
      width: 130,
      editable: true,
      type: 'number',
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        return cost?.amazon_commission ?? 0;
      },
      valueParser: (value: string) => Number(value)
    },
    {
      field: 'amazon_selling_price',
      headerName: 'Amazon Satış Fiyatı',
      width: 130,
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        const price = cost?.amazon_selling_price;
        return typeof price === 'number' ? Number(price.toFixed(2)) : 0;
      }
    },
    {
      field: 'hepsiburada_commission',
      headerName: 'Hepsiburada Komisyonu (%)',
      width: 130,
      editable: true,
      type: 'number',
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        return cost?.hepsiburada_commission ?? 0;
      },
      valueParser: (value: string) => Number(value)
    },
    {
      field: 'hepsiburada_selling_price',
      headerName: 'Hepsiburada Satış Fiyatı',
      width: 130,
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        const price = cost?.hepsiburada_selling_price;
        return typeof price === 'number' ? Number(price.toFixed(2)) : 0;
      }
    },
    {
      field: 'trendyol_commission',
      headerName: 'Trendyol Komisyonu (%)',
      width: 130,
      editable: true,
      type: 'number',
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        return cost?.trendyol_commission ?? 0;
      },
      valueParser: (value: string) => Number(value)
    },
    {
      field: 'trendyol_selling_price',
      headerName: 'Trendyol Satış Fiyatı',
      width: 130,
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        const price = cost?.trendyol_selling_price;
        return typeof price === 'number' ? Number(price.toFixed(2)) : 0;
      }
    },
    {
      field: 'payment_commission',
      headerName: 'Ödeme Komisyonu (%)',
      width: 130,
      editable: true,
      type: 'number',
      valueGetter: (params: GridValueGetterParams) => {
        const cost = params.row.costs?.[0];
        return cost?.payment_commission ?? 0;
      },
      valueParser: (value: string) => Number(value)
    }
  ];

  const processRowUpdate = async (newRow: any, oldRow: any) => {
    try {
      const field = Object.keys(newRow).find(key => newRow[key] !== oldRow[key]);
      if (field && field !== 'id') {
        await handleCostUpdate(newRow.id, field, newRow[field]);
      }
      return newRow;
    } catch (error) {
      console.error('Satır güncellenirken hata oluştu:', error);
      return oldRow;
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <h1>Fiyatlama Paneli</h1>
          <GoldPriceDisplay goldPrice={goldPrice} />
        </Box>

        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={products}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 }
              }
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(error) => {
              console.error('Satır güncelleme hatası:', error);
              alert('Değer güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
            }}
            getRowId={(row) => row.id}
            editMode="cell"
            isCellEditable={(params) => {
              return params.field !== 'id' && 
                     params.field !== 'sku' && 
                     params.field !== 'weight';
            }}
          />
        </Box>
      </Box>
    </Container>
  );
}
