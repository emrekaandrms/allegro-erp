import React from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel, GridActionsCellItem } from '@mui/x-data-grid';
import { Product } from '../types/types';
import { useAuth } from '../hooks/useAuth';
import { Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  products: Product[];
  onProductSelect: (productId: number) => void;
  onSelectionChange?: (ids: number[]) => void;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
  selectable?: boolean;
}

const COLOR_MAP: { [key: string]: string } = {
  'S': 'Sarı',
  'B': 'Beyaz',
  'R': 'Rose'
};

export function ProductTable({ 
  products, 
  onProductSelect, 
  onSelectionChange, 
  onDelete,
  onEdit,
  selectable = false 
}: Props) {
  const { role } = useAuth();

  const handleDelete = (id: number) => {
    if (onDelete) {
      if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
        onDelete(id);
      }
    }
  };

  const handleEdit = (id: number) => {
    if (onEdit) {
      onEdit(id);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'sku', headerName: 'SKU', width: 150 },
    { field: 'karat', headerName: 'Karat', width: 100 },
    { 
      field: 'color', 
      headerName: 'Renk', 
      width: 100,
      valueGetter: (params) => COLOR_MAP[params.row.color] || params.row.color
    },
    { field: 'type', headerName: 'Ürün Tipi', width: 120 },
    { field: 'weight', headerName: 'Ağırlık (gr)', width: 100 },
    { field: 'thickness', headerName: 'Kalınlık (mm)', width: 100 },
    { field: 'width', headerName: 'Genişlik (mm)', width: 100 },
    { field: 'length', headerName: 'Uzunluk', width: 100 },
    { field: 'status', headerName: 'Durum', width: 120 },
    { 
      field: 'created_at', 
      headerName: 'Oluşturulma Tarihi', 
      width: 180,
      valueGetter: (params) => {
        return new Date(params.row.created_at).toLocaleString('tr-TR');
      }
    },
    { 
      field: 'updated_at', 
      headerName: 'Güncellenme Tarihi', 
      width: 180,
      valueGetter: (params) => {
        return new Date(params.row.updated_at).toLocaleString('tr-TR');
      }
    }
  ];

  // Eğer silme ve düzenleme fonksiyonları verilmişse, actions kolonu ekle
  if (onDelete || onEdit) {
    columns.push({
      field: 'actions',
      type: 'actions',
      headerName: 'İşlemler',
      width: 100,
      getActions: (params) => {
        const actions = [];
        
        if (onEdit) {
          actions.push(
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Düzenle"
              onClick={() => handleEdit(params.row.id)}
            />
          );
        }
        
        if (onDelete) {
          actions.push(
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Sil"
              onClick={() => handleDelete(params.row.id)}
            />
          );
        }
        
        return actions;
      }
    });
  }

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={products}
        columns={columns}
        checkboxSelection={selectable}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 }
          }
        }}
        pageSizeOptions={[5, 10, 25]}
        onRowClick={(params) => onProductSelect(params.row.id)}
        onRowSelectionModelChange={(newSelectionModel: GridRowSelectionModel) => {
          if (onSelectionChange) onSelectionChange(newSelectionModel as number[]);
        }}
      />
    </Box>
  );
}
