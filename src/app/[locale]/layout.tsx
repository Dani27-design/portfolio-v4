import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://daniansyah.dev'),
  title: {
    default: 'Daniansyah Chusyaidin | Fullstack & Mobile Engineer',
    template: '%s | Daniansyah Chusyaidin',
  },
  description:
    'High-fidelity portfolio for Daniansyah Chusyaidin - Fullstack & Mobile Engineer.',
  openGraph: {
    type: 'website',
    siteName: 'Daniansyah Chusyaidin Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                var isCode = localStorage.getItem('isCodeMode') === 'true';
                if (!theme) {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.classList.add(theme);
                if (isCode) document.documentElement.classList.add('code');
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background text-text-main font-sans antialiased transition-colors duration-300">
        <ThemeProvider>
          <NextIntlClientProvider>
            <div id="top" className="min-h-screen selection:bg-blue-100 selection:text-primary transition-colors duration-300">
              <CustomCursor />
              <ScrollToTop />
              <ScrollProgress />
              <Navbar />
              <main>{children}</main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
