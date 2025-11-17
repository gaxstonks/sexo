
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, passwordHash: hash }
    });
    return NextResponse.json({ ok: true });
  } catch(e) {
    return NextResponse.json({ error: 'User exists' }, { status: 400 });
  }
}
