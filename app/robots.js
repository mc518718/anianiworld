import { SITE_URL } from '@/lib/config';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/account', '/login', '/register', '/reset-password', '/stats', '/search'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
