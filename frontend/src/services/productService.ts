export async function listProducts(token:string) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/products/list`, {
    headers:{Authorization:'Bearer '+token}
  });
  if(!res.ok) throw new Error('Error listing products');
  return res.json();
}

export async function createProduct(token:string, data:any) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/products/create`, {
    method:'POST',
    headers:{'Content-Type':'application/json', Authorization:'Bearer '+token},
    body:JSON.stringify(data)
  });
  if(!res.ok) throw new Error('Error creating product');
  return res.json();
}

export async function setPhotoRequired(token:string, ids:number[]) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/products/setPhotoRequired`, {
    method:'POST',
    headers:{'Content-Type':'application/json', Authorization:'Bearer '+token},
    body:JSON.stringify({ids})
  });
  if(!res.ok) throw new Error('Error updating photo required');
  return res.json();
}
