import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if(!user) return NextResponse.json({ ok: true }); // don't reveal
  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h
  await prisma.user.update({ where: { email }, data: { resetToken: token, resetTokenExpires: expires } });
  if(process.env.SMTP_HOST && process.env.SMTP_USER) {
    // send email (not implemented here)
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: true, token });
}
