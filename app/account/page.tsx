'use client';
import { useEffect, useState } from 'react';

export default function AccountPage(){
  const [user, setUser] = useState<any>(null);
  useEffect(()=>{
    fetch('/api/auth/me').then(r=>r.json()).then(d=>setUser(d)).catch(()=>{});
  },[]);
  async function uploadFile(e:any){
    const f = e.target.files[0];
    const data = await f.arrayBuffer();
    const b64 = Buffer.from(data).toString('base64');
    const res = await fetch('/api/upload',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ userId: user?.id, name: f.name, data: b64 })});
    const j = await res.json();
    alert(JSON.stringify(j));
  }
  if(!user) return <div>Loading...</div>;
  return <div style={{padding:20}}>
    <h2>Minha Conta</h2>
    <p>Email: {user.email}</p>
    <input type="file" onChange={uploadFile} />
  </div>;
}
