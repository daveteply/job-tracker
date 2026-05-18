import { MetadataRoute } from 'next';

import { BRANDING } from '@job-tracker/domain';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['en-US', 'es-US'];
  const routes = ['', '/privacy', '/terms', '/data-deletion', '/beta'];
  const baseUrl = `https://${BRANDING.domain}`;

  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
