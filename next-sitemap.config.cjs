/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://dani-chusyaidin.vercel.app',
  generateRobotsTxt: false,
  generateIndexSitemap: true,
  // Exclude all auto-discovered routes — we define everything manually via additionalPaths
  exclude: ['/**'],
  additionalPaths: async () => {
    const locales = ['en', 'id'];
    const staticPages = ['', '/blog', '/projects'];
    const paths = [];

    for (const page of staticPages) {
      for (const locale of locales) {
        paths.push({
          loc: `/${locale}${page}`,
          changefreq: 'weekly',
          priority: page === '' ? 1.0 : 0.8,
          lastmod: new Date().toISOString(),
        });
      }
    }

    return paths;
  },
};
