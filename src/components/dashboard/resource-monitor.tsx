'use client';

import { AnimatedCard } from '@/components/shared/animated-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useResourceInfo } from '@/lib/hooks/useResourceInfo';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils/cn';

export function ResourceMonitor() {
  const { data, isLoading, error } = useResourceInfo();

  if (error) {
    return (
      <AnimatedCard title="Server Resources" animationType="slide">
        <Alert variant="destructive">
          <AlertDescription>Failed to load resource info: {error.message}</AlertDescription>
        </Alert>
      </AnimatedCard>
    );
  }

  if (isLoading || !data) {
    return (
      <AnimatedCard title="Server Resources" animationType="slide">
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </AnimatedCard>
    );
  }

  const getCpuColor = (percent: number) => {
    if (percent >= 80) return '[&>div]:bg-red-500';
    if (percent >= 60) return '[&>div]:bg-orange-500';
    return '[&>div]:bg-green-500';
  };

  const getMemoryColor = (percent: number) => {
    if (percent >= 85) return '[&>div]:bg-red-500';
    if (percent >= 70) return '[&>div]:bg-orange-500';
    return '[&>div]:bg-blue-500';
  };

  return (
    <AnimatedCard title="Server Resources" animationType="slide">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">CPU Usage</span>
            <span className="text-sm text-muted-foreground">{data.cpu_percent.toFixed(1)}%</span>
          </div>
          <Progress value={data.cpu_percent} className={cn("h-2", getCpuColor(data.cpu_percent))} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Memory Usage</span>
            <span className="text-sm text-muted-foreground">
              {data.memory_percent.toFixed(1)}% ({data.memory_available_gb.toFixed(1)} GB available)
            </span>
          </div>
          <Progress value={data.memory_percent} className={cn("h-2", getMemoryColor(data.memory_percent))} />
        </div>
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-2xl font-bold">{data.current_workers}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Recommended</p>
            <p className="text-2xl font-bold">{data.recommended_workers}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Max</p>
            <p className="text-2xl font-bold">{data.max_workers}</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm font-medium">Server Status</span>
          <Badge variant={data.is_busy ? 'destructive' : 'default'}>
            {data.is_busy ? 'Busy' : 'Available'}
          </Badge>
        </div>
      </div>
    </AnimatedCard>
  );
}
