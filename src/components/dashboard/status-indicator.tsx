'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { TaskStatus } from '@/lib/types/api';
import { cn } from '@/lib/utils/cn';

interface StatusIndicatorProps {
  status: TaskStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig: Record<TaskStatus, { label: string; className: string; animate?: boolean }> = {
  [TaskStatus.PENDING]: {
    label: 'Pending',
    className: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20',
    animate: false,
  },
  [TaskStatus.RUNNING]: {
    label: 'Running',
    className: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
    animate: true,
  },
  [TaskStatus.COMPLETED]: {
    label: 'Completed',
    className: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20',
    animate: false,
  },
  [TaskStatus.FAILED]: {
    label: 'Failed',
    className: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
    animate: false,
  },
  [TaskStatus.CANCELLED]: {
    label: 'Cancelled',
    className: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
    animate: false,
  },
  [TaskStatus.PAUSED]: {
    label: 'Paused',
    className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20',
    animate: false,
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function StatusIndicator({ status, size = 'md', className }: StatusIndicatorProps) {
  const config = statusConfig[status];

  const pulseAnimation = config.animate
    ? {
        animate: {
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1],
        },
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        },
      }
    : {};

  return (
    <motion.div {...pulseAnimation}>
      <Badge
        variant="outline"
        className={cn(config.className, sizeClasses[size], 'font-medium', className)}
      >
        <span className="relative flex h-2 w-2 mr-1.5">
          <span
            className={cn(
              'absolute inline-flex h-full w-full rounded-full opacity-75',
              config.animate && 'animate-ping',
              status === TaskStatus.RUNNING && 'bg-blue-400',
              status === TaskStatus.COMPLETED && 'bg-green-400',
              status === TaskStatus.FAILED && 'bg-red-400'
            )}
          />
          <span
            className={cn(
              'relative inline-flex rounded-full h-2 w-2',
              status === TaskStatus.PENDING && 'bg-gray-400',
              status === TaskStatus.RUNNING && 'bg-blue-500',
              status === TaskStatus.COMPLETED && 'bg-green-500',
              status === TaskStatus.FAILED && 'bg-red-500',
              status === TaskStatus.CANCELLED && 'bg-orange-500',
              status === TaskStatus.PAUSED && 'bg-yellow-500'
            )}
          />
        </span>
        {config.label}
      </Badge>
    </motion.div>
  );
}
