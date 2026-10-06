import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
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
            fontSize: 14,
            color: '#64748b',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          obscura.studio
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 300,
            color: '#0f172a',
            lineHeight: 0.9,
            marginBottom: 24,
          }}
        >
          OBSCURA
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#64748b',
            letterSpacing: '0.1em',
          }}
        >
          Design × Photography
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
