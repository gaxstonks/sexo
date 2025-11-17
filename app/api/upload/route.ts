import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
const prisma = new PrismaClient();

export async function POST(req:Request){
  try{
    const { userId, name, data } = await req.json(); // data = base64 string
    if(!userId || !data) return NextResponse.json({ error:'invalid' }, { status:400 });
    const buf = Buffer.from(data, 'base64');
    const uploads = path.join(process.cwd(), 'public', 'uploads');
    if(!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive:true });
    const filename = Date.now()+ '-' + (name || 'file');
    const filepath = path.join(uploads, filename);
    fs.writeFileSync(filepath, buf);
    const rel = '/uploads/' + filename;
    await prisma.file.create({ data: { userId, path: rel, label: name } });
    return NextResponse.json({ ok:true, path: rel });
  }catch(e){
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status:500 });
  }
}
