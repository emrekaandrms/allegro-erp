export async function listPendingPhotos(token:string) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/photos/pending`, {
    headers:{Authorization:'Bearer '+token}
  });
  if(!res.ok) throw new Error('Error listing pending photos');
  return res.json();
}

export async function uploadPhoto(token:string, productId:number, photoUrl:string) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/photos/upload`, {
    method:'POST',
    headers:{'Content-Type':'application/json', Authorization:'Bearer '+token},
    body:JSON.stringify({productId, photoUrl})
  });
  if(!res.ok) throw new Error('Error uploading photo');
  return res.json();
}
