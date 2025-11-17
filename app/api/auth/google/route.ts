import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT = (process.env.NEXTAUTH_URL || '').replace(/\/$/, '') + '/api/auth/google';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  if(!code) {
    const auth = 'https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=openid email profile&access_type=offline&prompt=consent' +
      `&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT)}`;
    return NextResponse.redirect(auth);
  }
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type':'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET, redirect_uri: REDIRECT, grant_type: 'authorization_code'
    })
  });
  const token = await tokenRes.json();
  const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: 'Bearer ' + token.access_token } });
  const userinfo = await userinfoRes.json();
  const user = await prisma.user.upsert({
    where: { email: userinfo.email },
    update: { googleId: userinfo.sub },
    create: { email: userinfo.email, name: userinfo.name, googleId: userinfo.sub }
  });
  const jwt = (await import('jsonwebtoken')).default;
  const SECRET = process.env.JWT_SECRET || 'devsecret';
  const t = jwt.sign({ uid: user.id }, SECRET, { expiresIn: '15m' });
  const refresh = cryptoRandom();
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: refresh } });
  const res = NextResponse.redirect('/');
  res.cookies.set('token', t, { httpOnly: true, path: '/', maxAge: 60*15 });
  res.cookies.set('refresh', encodeURIComponent(refresh), { httpOnly: true, path: '/', maxAge: 60*60*24*30 });
  return res;
}

function cryptoRandom() { return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2); }
