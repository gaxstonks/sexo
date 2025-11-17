
'use client';
import { useState } from 'react';

export default function Login() {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [msg,setMsg]=useState('');

  async function submit() {
    const r = await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
    if(r.ok) location.href='/';
    else setMsg('Credenciais inválidas');
  }

  return <div className='p-10 max-w-md mx-auto'>
    <h1>Login</h1>
    <input placeholder='Email' onChange={e=>setEmail(e.target.value)} className='border p-2 w-full'/>
    <input type='password' placeholder='Senha' onChange={e=>setPassword(e.target.value)} className='border p-2 w-full mt-2'/>
    <button onClick={submit} className='p-2 bg-blue-500 text-white mt-2 w-full'>Entrar</button>
    {msg && <p>{msg}</p>}
  </div>;
}
