import { Cost } from '../types/types';

export const listCosts = async (token: string): Promise<Cost[]> => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/costs/list`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Maliyetler yüklenirken hata oluştu');
  return response.json();
};

export const getCost = async (token: string, productId: number): Promise<Cost | null> => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/costs/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Maliyet bilgisi yüklenirken hata oluştu');
  return response.json();
};

export const createCost = async (token: string, data: any): Promise<void> => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/costs/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Maliyet kaydedilirken hata oluştu');
  }
};

export const updateCost = async (token: string, productId: number, data: any): Promise<void> => {
  console.log('Gönderilen veri:', {
    url: `${process.env.REACT_APP_API_URL}/costs/update/${productId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    data
  });

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/costs/update/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product_id: productId,
        ...data
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend yanıtı:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      let errorMessage;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || 'Maliyet güncellenirken hata oluştu';
      } catch {
        errorMessage = `HTTP Hata ${response.status}: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Tam hata detayı:', error);
    throw error;
  }
};

export const exportCosts = async (token: string): Promise<void> => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/costs/export`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Maliyetler dışa aktarılırken hata oluştu');
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'costs.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
