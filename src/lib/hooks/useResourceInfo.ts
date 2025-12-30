'use client';

import { usePolling } from './usePolling';
import { scraperApi } from '@/lib/api/scraper';
import { API_CONFIG } from '@/config/api.config';
import type { ResourceInfo } from '@/lib/types/api';

export function useResourceInfo() {
  return usePolling<ResourceInfo>(
    () => scraperApi.getResources(),
    API_CONFIG.POLLING_INTERVALS.RESOURCES,
    {
      enabled: true,
      onError: (error) => {
        console.error('Failed to fetch resource info:', error);
      },
    }
  );
}
