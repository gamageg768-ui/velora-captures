import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import ProposalDocument from '@/components/admin/ProposalDocument';

export const runtime = 'nodejs';

function isAuthorized(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_auth')?.value;
  return !!token && token === process.env.ADMIN_SECRET;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthorized()) {
    return new Response('Unauthorized', { status: 401 });
  }

  const inquiry = await prisma.inquiry.findUnique({
    where: { id: params.id },
  });

  if (!inquiry) {
    return new Response('Inquiry not found', { status: 404 });
  }

  const element = createElement(ProposalDocument, { inquiry }) as ReactElement<DocumentProps>;

  let buffer: Buffer;
  try {
    buffer = await renderToBuffer(element);
  } catch (err) {
    console.error('PDF generation failed:', err);
    return new Response('Failed to generate PDF.', { status: 500 });
  }

  const safeName = inquiry.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="proposal-${safeName}.pdf"`,
    },
  });
}
