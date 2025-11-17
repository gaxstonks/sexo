import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req:Request){
  try{
    const { email, password } = await req.json();
    if(!email || !password) return NextResponse.json({error:'invalid'}, {status:400});
    const exists = await prisma.user.findUnique({ where: { email } });
    if(exists) return NextResponse.json({ error: 'exists' }, { status: 400 });
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, password: hash } });
    return NextResponse.json({ ok: true });
  }catch(e){
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status:500 });
  }
}
