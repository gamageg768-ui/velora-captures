import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAuthorized(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_auth')?.value;
  return !!token && token === process.env.ADMIN_SECRET;
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized()) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body.' }, { status: 400 });
  }

  const { status, notes } = body as { status?: string; notes?: string };

  const data: { status?: string; notes?: string } = {};
  if (status !== undefined) data.status = status;
  if (notes !== undefined) data.notes = notes;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
  }

  try {
    const updated = await prisma.inquiry.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
  }
}
