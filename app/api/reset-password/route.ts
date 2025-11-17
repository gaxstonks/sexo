import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { token, password } = await req.json();
  const user = await prisma.user.findFirst({ where: { resetToken: token } });
  if(!user || !user.resetTokenExpires || new Date(user.resetTokenExpires) < new Date()) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  }
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash, resetToken: null, resetTokenExpires: null } });
  return NextResponse.json({ ok: true });
}
