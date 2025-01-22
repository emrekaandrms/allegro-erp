import React, { createContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string|null;
  role: string|null;
  setToken: (t:string)=>void;
  setRole: (r:string)=>void;
}

export const AuthContext = createContext<AuthContextType>({
  token:null,
  role:null,
  setToken: ()=>{},
  setRole: ()=>{}
});

export const AuthProvider:React.FC<{children:React.ReactNode}> = ({children}) => {
  const [token, setTokenState] = useState<string|null>(localStorage.getItem('token'));
  const [role, setRoleState] = useState<string|null>(localStorage.getItem('role'));

  useEffect(()=>{
    if(token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    if(role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');
  },[token, role]);

  return (
    <AuthContext.Provider value={{
      token,
      role,
      setToken:(t)=>setTokenState(t),
      setRole:(r)=>setRoleState(r)
    }}>
      {children}
    </AuthContext.Provider>
  );
}
