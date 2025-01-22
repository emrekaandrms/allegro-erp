export async function listSEONeeded(token:string) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/seo/seoNeeded`, {
    headers:{Authorization:'Bearer '+token}
  });
  if(!res.ok) throw new Error('Error listing SEO needed products');
  return res.json();
}

export async function setSEO(token:string, productId:number, seoData:any) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/seo/setSEO`, {
    method:'POST',
    headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
    body:JSON.stringify({productId, seoData})
  });
  if(!res.ok) throw new Error('Error setting SEO info');
  return res.json();
}
