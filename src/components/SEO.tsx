import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../i18n';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
}

const BASE_URL = 'https://daniansyah.dev'; // Update with actual domain

export const SEO: React.FC<SEOProps> = ({ title, description }) => {
  const { language } = useLanguage();
  const location = useLocation();

  // Get current path without language prefix
  const pathWithoutLang = location.pathname.replace(/^\/(en|id)/, '') || '/';

  // Construct alternate URLs
  const enUrl = `${BASE_URL}/en${pathWithoutLang}`;
  const idUrl = `${BASE_URL}/id${pathWithoutLang}`;
  const currentUrl = `${BASE_URL}${location.pathname}`;

  // Default SEO values
  const defaultTitle = language === 'en'
    ? 'Daniansyah - Systems Architect & Fullstack Engineer'
    : 'Daniansyah - Arsitek Sistem & Insinyur Fullstack';

  const defaultDescription = language === 'en'
    ? 'Systems Architect specializing in distributed systems, mobile cores, and high-performance backends. Building fault-tolerant solutions with end-to-end technical ownership.'
    : 'Arsitek Sistem yang berspesialisasi dalam sistem terdistribusi, inti mobile, dan backend performa tinggi. Membangun solusi fault-tolerant dengan kepemilikan teknis end-to-end.';

  const pageTitle = title ? `${title} | Daniansyah` : defaultTitle;
  const pageDescription = description || defaultDescription;

  return (
    <Helmet>
      {/* Basic Meta */}
      <html lang={language} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* hreflang for language alternatives */}
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="id" href={idUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={language === 'en' ? 'en_US' : 'id_ID'} />
      <meta property="og:locale:alternate" content={language === 'en' ? 'id_ID' : 'en_US'} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
    </Helmet>
  );
};
