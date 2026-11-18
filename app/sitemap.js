import { getAllSeriesRefs } from '@/lib/db';
import { SITE_URL } from '@/lib/config';

export const revalidate = 3600;

export default async function sitemap() {
  const shows = await getAllSeriesRefs();
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE_URL}/browse`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/tap-moi`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/latest`, lastModified: now, changeFrequency: 'hourly', priority: 0.7 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.1 },
    ...shows.map((s) => ({
      url: `${SITE_URL}/series/${encodeURIComponent(s.id)}`,
      lastModified: s.latest_episode_at ? new Date(s.latest_episode_at) : undefined,
      changeFrequency: 'weekly',
      priority: 0.6,
    })),
  ];
}
