'use client';

import { usePolling } from './usePolling';
import { scraperApi } from '@/lib/api/scraper';
import { API_CONFIG } from '@/config/api.config';
import { TaskStatus, type ProgressResponse } from '@/lib/types/api';

export function useBatchProgress() {
  const { data, isLoading, error, refetch } = usePolling<ProgressResponse>(
    () => scraperApi.getProgress(),
    API_CONFIG.POLLING_INTERVALS.PROGRESS,
    {
      enabled: true,
      onError: (error) => {
        console.error('Failed to fetch batch progress:', error);
      },
    }
  );

  const shouldPoll = data?.is_running === true;
  const isActive = data?.batch_info?.status === TaskStatus.RUNNING;

  return {
    data,
    isLoading,
    error,
    refetch,
    isActive,
    shouldPoll,
  };
}
