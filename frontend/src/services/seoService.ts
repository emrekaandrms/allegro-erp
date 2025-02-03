import { SEOInfo } from '../types/types';

export const listSEOInfos = async (token: string): Promise<SEOInfo[]> => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/seo/list`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('SEO bilgileri yüklenirken hata oluştu');
  return response.json();
};

export const getSEOInfo = async (token: string, productId: number): Promise<SEOInfo | null> => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/seo/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('SEO bilgisi yüklenirken hata oluştu');
  return response.json();
};

export const createSEOInfo = async (token: string, data: {
  product_id: number;
  platform: string;
  title: string;
  description: string;
  meta_title: string;
  meta_description: string;
}): Promise<void> => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/seo/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('SEO bilgisi kaydedilirken hata oluştu');
};

export const updateSEOInfo = async (token: string, productId: number, data: {
  platform: string;
  title: string;
  description: string;
  meta_title: string;
  meta_description: string;
}): Promise<void> => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/seo/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('SEO bilgisi güncellenirken hata oluştu');
};
