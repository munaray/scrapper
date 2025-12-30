'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export interface UsePollingOptions {
  enabled?: boolean;
  onError?: (error: Error) => void;
}

export interface UsePollingResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Generic polling hook for real-time updates
 * @param fetcher - Function that returns a promise with the data
 * @param interval - Polling interval in milliseconds
 * @param options - Configuration options
 */
export function usePolling<T>(
  fetcher: () => Promise<T>,
  interval: number,
  options: UsePollingOptions = {}
): UsePollingResult<T> {
  const { enabled = true, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

  const fetch = useCallback(async () => {
    if (!enabled) return;

    try {
      const result = await fetcher();
      if (isMountedRef.current) {
        setData(result);
        setError(null);
        setIsLoading(false);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      if (isMountedRef.current) {
        setError(error);
        setIsLoading(false);
      }
      onError?.(error);
    }
  }, [fetcher, enabled, onError]);

  useEffect(() => {
    if (enabled) {
      fetch();
    }
  }, [fetch, enabled]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else if (document.visibilityState === 'visible') {
        fetch();
        intervalRef.current = setInterval(fetch, interval);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (document.visibilityState === 'visible') {
      intervalRef.current = setInterval(fetch, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetch, interval, enabled]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return { data, isLoading, error, refetch: fetch };
}
