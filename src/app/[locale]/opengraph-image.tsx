import { ImageResponse } from 'next/og';

export const revalidate = 3600;
export const alt = 'Daniansyah Chusyaidin - Systems Architect & Fullstack Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          backgroundColor: '#0f1115',
          fontFamily: 'monospace',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f1115',
              fontSize: '20px',
              fontWeight: 900,
            }}
          >
            DC
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
              Portfolio
            </span>
          </div>
        </div>

        {/* Center */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, justifyContent: 'center' }}>
          <span
            style={{
              fontSize: '52px',
              color: '#f8fafc',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Daniansyah Chusyaidin
          </span>
          <span
            style={{
              fontSize: '22px',
              color: '#94a3b8',
              lineHeight: 1.4,
              maxWidth: '700px',
            }}
          >
            Systems Architect & Fullstack Engineer
          </span>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <span style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', padding: '6px 16px', border: '1px solid rgba(6,182,212,0.3)', backgroundColor: 'rgba(6,182,212,0.08)' }}>
              Distributed Systems
            </span>
            <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', padding: '6px 16px', border: '1px solid rgba(99,102,241,0.3)', backgroundColor: 'rgba(99,102,241,0.08)' }}>
              Mobile Architecture
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '24px', height: '3px', background: 'linear-gradient(to right, #06b6d4, #6366f1)' }} />
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Fullstack & Mobile Engineer
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#334155', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            dani-chusyaidin.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
