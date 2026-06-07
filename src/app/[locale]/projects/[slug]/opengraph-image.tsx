import { ImageResponse } from 'next/og';
import { getProjectBySlug } from '@/lib/firestore';
import type { Locale } from '@/types';

export const dynamic = 'force-dynamic';
export const alt = 'Project';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  const loc = locale as Locale;

  const title = project?.name[loc] || 'Project';
  const desc = project?.desc[loc] || '';
  const tech = project?.tech || [];

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
              width: '40px',
              height: '40px',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f1115',
              fontSize: '18px',
              fontWeight: 900,
            }}
          >
            DC
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '14px', color: '#f8fafc', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Daniansyah Chusyaidin
            </span>
            <span style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              Project Case Study
            </span>
          </div>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
          <span style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
            PROJECT :: CASE_STUDY
          </span>
          <span
            style={{
              fontSize: title.length > 60 ? '36px' : '48px',
              color: '#f8fafc',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </span>
          {desc && (
            <span
              style={{
                fontSize: '18px',
                color: '#94a3b8',
                lineHeight: 1.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxHeight: '54px',
              }}
            >
              {desc.length > 120 ? desc.substring(0, 120) + '...' : desc}
            </span>
          )}
          {tech.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              {tech.slice(0, 5).map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: '11px',
                    color: '#6366f1',
                    fontWeight: 700,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    padding: '4px 12px',
                    border: '1px solid rgba(99,102,241,0.3)',
                    backgroundColor: 'rgba(99,102,241,0.08)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
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
