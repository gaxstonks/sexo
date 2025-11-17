import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'devsecret';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if(!user || !user.passwordHash) return NextResponse.json({ error: 'Invalid' }, { status: 401 });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return NextResponse.json({ error: 'Invalid' }, { status: 401 });
  const token = jwt.sign({ uid: user.id }, SECRET, { expiresIn: '15m' });
  const refresh = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  await prisma.user.update({ where: { id: user.id }, data: { refreshToken: refresh } });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60*15 });
  res.cookies.set('refresh', encodeURIComponent(refresh), { httpOnly: true, path: '/', maxAge: 60*60*24*30 });
  return res;
}
