import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'devsecret';

export async function POST(req:Request){
  try{
    const { email, password } = await req.json();
    if(!email || !password) return NextResponse.json({error:'invalid'},{status:400});
    const user = await prisma.user.findUnique({ where: { email } });
    if(!user || !user.password) return NextResponse.json({ error: 'invalid' }, { status: 401 });
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return NextResponse.json({ error: 'invalid' }, { status: 401 });
    const token = jwt.sign({ uid: user.id }, SECRET, { expiresIn: '7d' });
    const res = NextResponse.json({ ok: true });
    res.cookies.set('token', token, { httpOnly:true, path:'/', maxAge:60*60*24*7 });
    return res;
  }catch(e){
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status:500 });
  }
}
