import { MetadataRoute } from 'next';

import { BRANDING } from '@job-tracker/domain';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `https://${BRANDING.domain}/sitemap.xml`,
  };
}
