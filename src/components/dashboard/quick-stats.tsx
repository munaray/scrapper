'use client';

import { StatCard } from '@/components/shared/stat-card';
import { useBatchProgress } from '@/lib/hooks/useBatchProgress';
import { Skeleton } from '@/components/ui/skeleton';

export function QuickStats() {
  const { data, isLoading } = useBatchProgress();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 col-span-full">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  const batch = data?.batch_info;
  const progressPercent = batch
    ? batch.total_urls > 0
      ? ((batch.completed_urls + batch.failed_urls) / batch.total_urls) * 100
      : 0
    : 0;

  const successRate = batch
    ? batch.completed_urls + batch.failed_urls > 0
      ? (batch.completed_urls / (batch.completed_urls + batch.failed_urls)) * 100
      : 0
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 col-span-full">
      <StatCard
        title="Total URLs"
        value={batch?.total_urls || 0}
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
      />

      <StatCard
        title="Jobs Found"
        value={batch?.total_jobs_found || 0}
        trend="up"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        }
      />

      <StatCard
        title="Success Rate"
        value={Math.round(successRate)}
        trend={successRate >= 80 ? 'up' : successRate >= 50 ? 'neutral' : 'down'}
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      <StatCard
        title="Progress"
        value={Math.round(progressPercent)}
        trend={progressPercent > 0 ? 'up' : 'neutral'}
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
      />
    </div>
  );
}
