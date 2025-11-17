import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'devsecret';

export async function GET(req:Request){
  try{
    const cookie = req.headers.get('cookie') || '';
    const m = cookie.match(/token=([^;]+)/);
    if(!m) return NextResponse.json({ error: 'no' }, { status: 401 });
    const token = decodeURIComponent(m[1]);
    const p = jwt.verify(token, SECRET) as any;
    const user = await prisma.user.findUnique({ where: { id: p.uid } });
    if(!user) return NextResponse.json({ error: 'no' }, { status:401 });
    return NextResponse.json({ email: user.email, name: user.name });
  }catch(e){
    return NextResponse.json({ error: 'no' }, { status:401 });
  }
}
