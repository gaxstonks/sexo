'use client'
import { useEffect, useState } from 'react';
export default function Account() {
  const [user, setUser] = useState(null);
  useEffect(()=>{
    fetch('/api/user?uid=' + (new URLSearchParams(window.location.search).get('uid') || '') )
    .then(r=>r.json()).then(setUser).catch(()=>{});
  },[]);
  return <div className='p-10'>
    <h1>Minha Conta</h1>
    {user ? <div><p>Email: {user.email}</p><p>Nome: {user.name}</p></div> : <p>Faça login</p>}
    <form method='post' action='/api/logout'><button type='submit' className='p-2 bg-gray-700 text-white mt-2'>Logout</button></form>
  </div>
}
