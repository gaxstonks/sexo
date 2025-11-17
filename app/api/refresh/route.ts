import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || 'devsecret';
export async function POST(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const m = cookie.match(/refresh=([^;]+)/);
    if(!m) return NextResponse.json({ error: 'No refresh' }, { status: 401 });
    const token = decodeURIComponent(m[1]);
    const session = await prisma.user.findFirst({ where: { refreshToken: token } });
    if(!session) return NextResponse.json({ error: 'Invalid' }, { status:401 });
    const payload = { uid: session.id };
    const t = jwt.sign(payload, SECRET, { expiresIn: '15m' });
    const res = NextResponse.json({ ok: true });
    res.cookies.set('token', t, { httpOnly: true, path: '/', maxAge: 60*15 });
    return res;
  } catch(e) { return NextResponse.json({ error: String(e) }, { status: 500 }); }
}
