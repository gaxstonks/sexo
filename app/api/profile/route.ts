import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req:Request){
  try{
    const { userId, name } = await req.json();
    if(!userId) return NextResponse.json({ error:'no' }, { status:400 });
    await prisma.user.update({ where: { id: userId }, data: { name } });
    return NextResponse.json({ ok:true });
  }catch(e){
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status:500 });
  }
}
