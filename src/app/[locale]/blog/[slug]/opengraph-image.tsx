import { ImageResponse } from 'next/og';
import { getBlogBySlug } from '@/lib/firestore';
import type { Locale } from '@/types';

export const revalidate = 3600;
export const alt = 'Blog post';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const blog = await getBlogBySlug(slug);
  const loc = locale as Locale;

  const title = blog?.title[loc] || 'Blog Post';
  const excerpt = blog?.excerpt[loc] || '';
  const date = blog?.date || '';

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
              Technical Log
            </span>
          </div>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
          <span style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase' }}>
            LOG_TYPE :: TECHNICAL_LOG
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
          {excerpt && (
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
              {excerpt.length > 120 ? excerpt.substring(0, 120) + '...' : excerpt}
            </span>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '24px', height: '3px', background: 'linear-gradient(to right, #06b6d4, #6366f1)' }} />
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {date}
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
