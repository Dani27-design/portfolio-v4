import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import { SEO } from '../components/SEO';

export const LanguageLayout: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();

  // Validate language param - redirect invalid languages to /en/
  if (!lang || (lang !== 'en' && lang !== 'id')) {
    return <Navigate to="/en/" replace />;
  }

  return (
    <LanguageProvider>
      <SEO />
      <Outlet />
    </LanguageProvider>
  );
};
