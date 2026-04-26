import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Real Stone | Field Ops';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          padding: '80px',
        }}
      >
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '300px',
            height: '300px',
            backgroundColor: '#000000',
            border: '10px solid #cda03a',
            marginBottom: '40px',
          }}
        >
          <span style={{ color: '#cda03a', fontSize: '180px', fontWeight: 900, fontFamily: 'monospace' }}>RS</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ color: '#ffffff', fontSize: '72px', margin: 0, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Real Stone</h1>
          <p style={{ color: '#cda03a', fontSize: '32px', margin: '10px 0 0 0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4em' }}>Field Intelligence</p>
        </div>
      </div>
    ),
    { ...size }
  );
}
