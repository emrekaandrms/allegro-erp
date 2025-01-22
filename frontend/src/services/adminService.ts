// frontend/src/services/adminService.ts

export async function listParams(token:string) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/params`, {
    headers:{Authorization:'Bearer '+token}
  });
  if(!res.ok) throw new Error('Error listing params');
  return res.json();
}

export async function updateParam(token:string, param_key:string, param_value:string) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/params/update`, {
    method:'POST',
    headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
    body:JSON.stringify({param_key,param_value})
  });
  if(!res.ok) throw new Error('Error updating param');
  return res.json();
}

export async function listUsers(token:string) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/users`, {
    headers:{Authorization:'Bearer '+token}
  });
  if(!res.ok) throw new Error('Error listing users');
  return res.json();
}

export async function createUser(token:string, email:string, password:string, role:string) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/users/create`, {
    method:'POST',
    headers:{'Content-Type':'application/json', Authorization:'Bearer '+token},
    body:JSON.stringify({email,password,role})
  });
  if(!res.ok) throw new Error('Error creating user');
  return res.json();
}

export async function updateUserRole(token:string, userId:number, role:string) {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/users/updateRole`, {
    method:'POST',
    headers:{'Content-Type':'application/json', Authorization:'Bearer '+token},
    body:JSON.stringify({userId,role})
  });
  if(!res.ok) throw new Error('Error updating user role');
  return res.json();
}
