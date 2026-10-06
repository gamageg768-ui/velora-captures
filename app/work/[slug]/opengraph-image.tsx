import { ImageResponse } from 'next/og';
import { projects } from '@/lib/projects';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  return [{ id: params.slug }];
}

export default async function OgImage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#ffffff',
          padding: '80px',
          justifyContent: 'flex-end',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: 13,
            color: '#0ea5e9',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          {project?.discipline ?? 'OBSCURA'}
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 300,
            color: '#0f172a',
            lineHeight: 0.9,
            marginBottom: 24,
          }}
        >
          {project?.title ?? 'OBSCURA'}
        </div>
        <div
          style={{
            fontSize: 22,
            color: '#64748b',
          }}
        >
          {project ? `${project.client} · ${project.year}` : 'Design × Photography'}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 20,
            background: '#0ea5e9',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
