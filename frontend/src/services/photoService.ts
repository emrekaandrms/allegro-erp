export async function listPendingPhotos(token:string) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/photos/pending`, {
    headers:{Authorization:'Bearer '+token}
  });
  if(!res.ok) throw new Error('Error listing pending photos');
  return res.json();
}

export const uploadPhoto = async (token: string, productId: number, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch(`${process.env.REACT_APP_API_URL}/photos/upload/${productId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) throw new Error('Fotoğraf yüklenirken hata oluştu');
};
