import { z } from 'zod';

export function isValidUrl(url: string): boolean {
  try {
    const urlToTest = url.includes('://') ? url : `https://${url}`;
    new URL(urlToTest);
    return true;
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  return url.includes('://') ? url : `https://${url}`;
}

export const batchScrapeSchema = z.object({
  urls: z.string().min(1, 'At least one URL is required'),
  max_workers: z.number()
    .min(1, 'Minimum 1 worker')
    .max(10, 'Maximum 10 workers')
    .optional(),
  max_records_per_file: z.number()
    .min(1, 'Minimum 1 record')
    .max(500, 'Maximum 500 records')
    .optional(),
  priority: z.number()
    .min(1, 'Minimum priority is 1')
    .max(5, 'Maximum priority is 5')
    .optional(),
});

export type BatchScrapeFormData = z.infer<typeof batchScrapeSchema>;

export function transformUrls(urlsString: string): string[] {
  const urls = urlsString.split('\n').map(url => url.trim()).filter(Boolean);

  if (urls.length === 0) {
    throw new Error('At least one valid URL is required');
  }

  if (!urls.every(isValidUrl)) {
    throw new Error('All URLs must be valid');
  }

  return urls.map(normalizeUrl);
}
