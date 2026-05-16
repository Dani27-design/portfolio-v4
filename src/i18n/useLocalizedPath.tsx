import { useLanguage } from './LanguageContext';

export const useLocalizedPath = () => {
  const { language } = useLanguage();

  return (path: string): string => {
    // Handle hash-only links (e.g., "#about")
    if (path.startsWith('#')) {
      return `/${language}/${path}`;
    }

    // Handle absolute paths (e.g., "/blog")
    if (path.startsWith('/')) {
      return `/${language}${path}`;
    }

    // Handle relative paths (e.g., "projects")
    return `/${language}/${path}`;
  };
};
