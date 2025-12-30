'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/shared/animated-card';
import { Progress } from '@/components/ui/progress';
import { StatusIndicator } from './status-indicator';
import { useBatchProgress } from '@/lib/hooks/useBatchProgress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDuration, formatRelativeTime } from '@/lib/utils/formatters';

export function BatchProgressCard() {
  const { data, isLoading, error } = useBatchProgress();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!data?.batch_info?.started_at) return;

    const startTime = new Date(data.batch_info.started_at).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedTime(Math.floor((now - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.batch_info?.started_at]);

  if (error) {
    return (
      <AnimatedCard title="Batch Progress" animationType="slide">
        <Alert variant="destructive">
          <AlertDescription>Failed to load progress: {error.message}</AlertDescription>
        </Alert>
      </AnimatedCard>
    );
  }

  if (isLoading) {
    return (
      <AnimatedCard title="Batch Progress" animationType="slide">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </AnimatedCard>
    );
  }

  if (!data?.is_running || !data?.batch_info) {
    return (
      <AnimatedCard title="Batch Progress" animationType="slide">
        <div className="text-center py-8 text-muted-foreground">
          <p>No active batch</p>
          <p className="text-sm mt-1">Start a new batch to see progress</p>
        </div>
      </AnimatedCard>
    );
  }

  const batch = data.batch_info;
  const progressPercent = batch.total_urls > 0
    ? ((batch.completed_urls + batch.failed_urls) / batch.total_urls) * 100
    : 0;

  return (
    <AnimatedCard title="Batch Progress" animationType="slide">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Batch ID</p>
            <p className="text-xs text-muted-foreground font-mono">{batch.batch_id}</p>
          </div>
          <StatusIndicator status={batch.status} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{progressPercent.toFixed(1)}%</span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5 }}
          >
            <Progress value={progressPercent} className="h-2" />
          </motion.div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          <div className="text-center">
            <p className="text-2xl font-bold">{batch.total_urls}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{batch.completed_urls}</p>
            <p className="text-xs text-muted-foreground">Done</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{batch.failed_urls}</p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{batch.pending_urls}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{batch.running_urls}</p>
            <p className="text-xs text-muted-foreground">Running</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-2 border-t">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Workers</p>
            <p className="text-lg font-bold">{batch.workers_active}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Jobs Found</p>
            <p className="text-lg font-bold">{batch.total_jobs_found}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Elapsed</p>
            <p className="text-lg font-bold">{formatDuration(elapsedTime)}</p>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
