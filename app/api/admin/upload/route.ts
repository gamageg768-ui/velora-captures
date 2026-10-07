import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function authed() {
  const secret = process.env.ADMIN_SECRET;
  const cookie = cookies().get('admin_auth')?.value;
  return secret && cookie === secret;
}

export async function GET() {
  if (!authed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const photos = await prisma.photo.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(photos);
}

export async function POST(req: Request) {
  if (!authed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const title = (form.get('title') as string)?.trim();
  const client = (form.get('client') as string)?.trim() || 'Personal Project';
  const year = (form.get('year') as string)?.trim() || new Date().getFullYear().toString();
  const discipline = (form.get('discipline') as string)?.trim() || 'Portrait';
  const description = (form.get('description') as string)?.trim() || null;

  if (!file || !title) {
    return NextResponse.json({ error: 'File and title are required' }, { status: 400 });
  }

  const ext = file.name.substring(file.name.lastIndexOf('.'));
  const baseSlug = slugify(title);
  const slug = `${baseSlug}-${Date.now()}`;

  const blob = await put(`work/${slug}${ext}`, file, { access: 'public' });

  const photo = await prisma.photo.create({
    data: { slug, title, client, year, discipline, description, imageUrl: blob.url },
  });

  return NextResponse.json(photo, { status: 201 });
}

export async function DELETE(req: Request) {
  if (!authed()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, imageUrl } = await req.json();
  if (imageUrl) {
    try { await del(imageUrl); } catch {}
  }
  await prisma.photo.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
