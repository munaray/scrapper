'use client';

import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/shared/animated-card';
import { StatusIndicator } from './status-indicator';
import { useBatchProgress } from '@/lib/hooks/useBatchProgress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { formatDuration } from '@/lib/utils/formatters';

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function ActiveTasksList() {
  const { data, isLoading, error } = useBatchProgress();

  if (error) {
    return (
      <AnimatedCard title="Active Tasks" animationType="slide">
        <Alert variant="destructive">
          <AlertDescription>Failed to load tasks: {error.message}</AlertDescription>
        </Alert>
      </AnimatedCard>
    );
  }

  if (isLoading) {
    return (
      <AnimatedCard title="Active Tasks" animationType="slide">
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </AnimatedCard>
    );
  }

  const tasks = data?.tasks || [];

  if (tasks.length === 0) {
    return (
      <AnimatedCard title="Active Tasks" animationType="slide">
        <div className="text-center py-8 text-muted-foreground">
          <p>No active tasks</p>
          <p className="text-sm mt-1">Tasks will appear here when a batch is running</p>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard title="Active Tasks" description={`${tasks.length} task(s)`} animationType="slide">
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3 max-h-96 overflow-y-auto pr-2"
      >
        {tasks.map((task) => {
          const duration = task.started_at
            ? Math.floor((new Date().getTime() - new Date(task.started_at).getTime()) / 1000)
            : 0;

          return (
            <motion.div
              key={task.task_id}
              variants={itemVariants}
              className="p-4 rounded-lg border bg-card"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.url}</p>
                    <p className="text-xs text-muted-foreground">Task ID: {task.task_id}</p>
                  </div>
                  <StatusIndicator status={task.status} size="sm" />
                </div>
                {task.progress_percent > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs text-muted-foreground">{task.progress_percent.toFixed(1)}%</span>
                    </div>
                    <Progress value={task.progress_percent} className="h-1" />
                  </div>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {task.worker_id !== undefined && <span>Worker #{task.worker_id}</span>}
                  <span>{task.jobs_found} jobs found</span>
                  {duration > 0 && <span>{formatDuration(duration)}</span>}
                </div>
                {task.error && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription className="text-xs">{task.error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </AnimatedCard>
  );
}
