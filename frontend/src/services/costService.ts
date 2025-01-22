export async function listPriceNeeded(token:string) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/costs/priceNeeded`, {
    headers:{Authorization:'Bearer '+token}
  });
  if(!res.ok) throw new Error('Error listing price needed products');
  return res.json();
}

export async function setPrice(token:string, productId:number) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/costs/setPrice`, {
    method:'POST',
    headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
    body:JSON.stringify({productId})
  });
  if(!res.ok) throw new Error('Error setting price');
  return res.json();
}
