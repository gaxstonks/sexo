'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedClient({ children }:{children:React.ReactNode}){
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(()=>{
    fetch('/api/auth/me').then(r=>{
      if (!r.ok) router.push('/auth');
      else setLoading(false);
    }).catch(()=> router.push('/auth'));
  },[]);
  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}
