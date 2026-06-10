import { ImageResponse } from 'next/og';

export async function GET() {
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
          backgroundColor: '#0b0d10',
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
              color: '#0b0d10',
              fontSize: '20px',
              fontWeight: 900,
            }}
          >
            DC
          </div>
          <span style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
            Mini Game
          </span>
        </div>

        {/* Center */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
          <span
            style={{
              fontSize: '56px',
              color: '#f8fafc',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Sky Defender
          </span>
          <span
            style={{
              fontSize: '22px',
              color: '#94a3b8',
              lineHeight: 1.4,
              maxWidth: '700px',
            }}
          >
            Can you beat the high score? Play now!
          </span>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', padding: '6px 16px', border: '1px solid rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.08)' }}>
              Space Shooter
            </span>
            <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', padding: '6px 16px', border: '1px solid rgba(251,191,36,0.3)', backgroundColor: 'rgba(251,191,36,0.08)' }}>
              Leaderboard
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '24px', height: '3px', background: 'linear-gradient(to right, #ef4444, #fbbf24)' }} />
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Interactive Mini Game
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#334155', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            dani-chusyaidin.vercel.app
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
