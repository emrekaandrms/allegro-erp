import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Product, SEOInfo } from '../types/types';

interface Props {
  products: Product[];
  onSelectionChange?: (ids: number[]) => void;
  selectable?: boolean;
}

export function SEOTable({ products, onSelectionChange, selectable = false }: Props) {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'sku', headerName: 'SKU', width: 130 },
    { 
      field: 'shopifyTitle', 
      headerName: 'Shopify Başlık', 
      width: 200,
      valueGetter: (params) => {
        const seoInfo = params.row.seo_infos?.find((info: SEOInfo) => info.platform === 'shopify');
        return seoInfo?.title || '-';
      }
    },
    { 
      field: 'shopifyDesc', 
      headerName: 'Shopify Açıklama', 
      width: 300,
      valueGetter: (params) => {
        const seoInfo = params.row.seo_infos?.find((info: SEOInfo) => info.platform === 'shopify');
        return seoInfo?.description || '-';
      }
    },
    { 
      field: 'etsyTitle', 
      headerName: 'Etsy Başlık', 
      width: 200,
      valueGetter: (params) => {
        const seoInfo = params.row.seo_infos?.find((info: SEOInfo) => info.platform === 'etsy');
        return seoInfo?.title || '-';
      }
    },
    { 
      field: 'etsyDesc', 
      headerName: 'Etsy Açıklama', 
      width: 300,
      valueGetter: (params) => {
        const seoInfo = params.row.seo_infos?.find((info: SEOInfo) => info.platform === 'etsy');
        return seoInfo?.description || '-';
      }
    },
    { 
      field: 'amazonTitle', 
      headerName: 'Amazon Başlık', 
      width: 200,
      valueGetter: (params) => {
        const seoInfo = params.row.seo_infos?.find((info: SEOInfo) => info.platform === 'amazon');
        return seoInfo?.title || '-';
      }
    },
    { 
      field: 'amazonDesc', 
      headerName: 'Amazon Açıklama', 
      width: 300,
      valueGetter: (params) => {
        const seoInfo = params.row.seo_infos?.find((info: SEOInfo) => info.platform === 'amazon');
        return seoInfo?.description || '-';
      }
    },
    { 
      field: 'hepsiburadaTitle', 
      headerName: 'Hepsiburada Başlık', 
      width: 200,
      valueGetter: (params) => {
        const seoInfo = params.row.seo_infos?.find((info: SEOInfo) => info.platform === 'hepsiburada');
        return seoInfo?.title || '-';
      }
    },
    { 
      field: 'hepsiburadaDesc', 
      headerName: 'Hepsiburada Açıklama', 
      width: 300,
      valueGetter: (params) => {
        const seoInfo = params.row.seo_infos?.find((info: SEOInfo) => info.platform === 'hepsiburada');
        return seoInfo?.description || '-';
      }
    },
    { 
      field: 'trendyolTitle', 
      headerName: 'Trendyol Başlık', 
      width: 200,
      valueGetter: (params) => {
        const seoInfo = params.row.seo_infos?.find((info: SEOInfo) => info.platform === 'trendyol');
        return seoInfo?.title || '-';
      }
    },
    { 
      field: 'trendyolDesc', 
      headerName: 'Trendyol Açıklama', 
      width: 300,
      valueGetter: (params) => {
        const seoInfo = params.row.seo_infos?.find((info: SEOInfo) => info.platform === 'trendyol');
        return seoInfo?.description || '-';
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