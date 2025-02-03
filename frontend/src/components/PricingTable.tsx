import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Product } from '../types/types';

interface Props {
  products: Product[];
  onSelectionChange?: (ids: number[]) => void;
  selectable?: boolean;
}

export function PricingTable({ products, onSelectionChange, selectable = false }: Props) {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'sku', headerName: 'SKU', width: 130 },
    { field: 'weight', headerName: 'Gram', width: 100 },
    { 
      field: 'goldPricePerGram', 
      headerName: 'Altın Gram Fiyatı ($)', 
      width: 150,
      valueGetter: (params) => {
        const cost = params.row.costs?.[0];
        return cost?.gold_price_per_gram || '-';
      }
    },
    { 
      field: 'laborCost', 
      headerName: 'İşçilik Maliyeti', 
      width: 150,
      valueGetter: (params) => {
        const cost = params.row.costs?.[0];
        return cost?.labor_cost || '-';
      }
    },
    { 
      field: 'shippingCost', 
      headerName: 'Kargo Maliyeti', 
      width: 150,
      valueGetter: (params) => {
        const cost = params.row.costs?.[0];
        return cost?.shipping_cost || '-';
      }
    },
    { 
      field: 'shopifyCommission', 
      headerName: 'Shopify Komisyonu', 
      width: 150,
      valueGetter: (params) => {
        const cost = params.row.costs?.[0];
        return cost?.shopify_commission || '-';
      }
    },
    { 
      field: 'etsyCommission', 
      headerName: 'Etsy Komisyonu', 
      width: 150,
      valueGetter: (params) => {
        const cost = params.row.costs?.[0];
        return cost?.etsy_commission || '-';
      }
    },
    { 
      field: 'amazonCommission', 
      headerName: 'Amazon Komisyonu', 
      width: 150,
      valueGetter: (params) => {
        const cost = params.row.costs?.[0];
        return cost?.amazon_commission || '-';
      }
    },
    { 
      field: 'hepsiburadaCommission', 
      headerName: 'Hepsiburada Komisyonu', 
      width: 150,
      valueGetter: (params) => {
        const cost = params.row.costs?.[0];
        return cost?.hepsiburada_commission || '-';
      }
    },
    { 
      field: 'trendyolCommission', 
      headerName: 'Trendyol Komisyonu', 
      width: 150,
      valueGetter: (params) => {
        const cost = params.row.costs?.[0];
        return cost?.trendyol_commission || '-';
      }
    },
    { 
      field: 'paymentCommission', 
      headerName: 'Ödeme Komisyonu', 
      width: 150,
      valueGetter: (params) => {
        const cost = params.row.costs?.[0];
        return cost?.payment_commission || '-';
      }
    },
    { 
      field: 'shopifyFinalPrice', 
      headerName: 'Shopify Final Fiyat', 
      width: 150,
      valueGetter: (params) => {
        const cost = params.row.costs?.[0];
        return cost?.shopify_final_price || '-';
      }
    },
    { 
      field: 'etsyFinalPrice', 
      headerName: 'Etsy Final Fiyat', 
      width: 150,
      valueGetter: (params) => {
        const cost = params.row.costs?.[0];
        return cost?.etsy_final_price || '-';
      }
    },
    { 
      field: 'amazonFinalPrice', 
      headerName: 'Amazon Final Fiyat', 
      width: 150,
      valueGetter: (params) => {
        const cost = params.row.costs?.[0];
        return cost?.amazon_final_price || '-';
      }
    },
    { 
      field: 'hepsiburadaFinalPrice', 
      headerName: 'Hepsiburada Final Fiyat', 
      width: 150,
      valueGetter: (params) => {
        const cost = params.row.costs?.[0];
        return cost?.hepsiburada_final_price || '-';
      }
    },
    { 
      field: 'trendyolFinalPrice', 
      headerName: 'Trendyol Final Fiyat', 
      width: 150,
      valueGetter: (params) => {
        const cost = params.row.costs?.[0];
        return cost?.trendyol_final_price || '-';
      }
    }
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={products}
        columns={columns}
        checkboxSelection={selectable}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 }
          }
        }}
        pageSizeOptions={[10, 25, 50]}
      />
    </div>
  );
} 