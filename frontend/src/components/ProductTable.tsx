import React from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Product } from '../types/types';

interface Props {
  products: Product[];
  onSelectionChange?: (ids: number[]) => void;
  selectable?: boolean;
}

export function ProductTable({ products, onSelectionChange, selectable = false }: Props) {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'sku', headerName: 'SKU', width: 150 },
    { field: 'weight', headerName: 'Ağırlık', width: 100 },
    { field: 'thickness', headerName: 'Kalınlık', width: 100 },
    { field: 'width', headerName: 'Genişlik', width: 100 },
    { field: 'length', headerName: 'Uzunluk', width: 100 },
    { field: 'status', headerName: 'Durum', width: 120 },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
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
        onRowSelectionModelChange={(newSelectionModel: GridRowSelectionModel) => {
          if (onSelectionChange) onSelectionChange(newSelectionModel as number[]);
        }}
      />
    </div>
  );
}
