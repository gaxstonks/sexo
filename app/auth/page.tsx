'use client';
import { useState } from 'react';

export default function AuthPage(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [mode,setMode]=useState<'login'|'register'>('login');
  async function submit(e:Event){
    e.preventDefault();
    const url = mode==='login'?'/api/auth/login':'/api/auth/register';
    const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    if(res.ok){ window.location.href='/'; }
    else { alert('Erro'); }
  }
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh'}}>
      <form onSubmit={(e)=>submit(e as any)} style={{width:320,display:'flex',flexDirection:'column',gap:8}}>
        <h2>{mode==='login'?'Entrar':'Criar conta'}</h2>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Senha" required />
        <div style={{display:'flex',gap:8}}>
          <button type="submit">{mode==='login'?'Entrar':'Criar'}</button>
          <button type="button" onClick={()=>setMode(mode==='login'?'register':'login')}>Toggle</button>
        </div>
      </form>
    </div>
  );
}
