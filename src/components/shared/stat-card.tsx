'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { formatNumber } from '@/lib/utils/formatters';

interface StatCardProps {
  title: string;
  value: number;
  change?: number; // Percentage change (+/-)
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({ title, value, change, icon, trend = 'neutral', className }: StatCardProps) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  const trendColors = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-muted-foreground',
  };

  return (
    <Card className={cn('hover:shadow-lg transition-shadow duration-200', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <motion.p className="text-3xl font-bold">
                {display.get().toLocaleString()}
              </motion.p>
              {change !== undefined && (
                <span className={cn('text-sm font-medium', trendColors[trend])}>
                  {change > 0 ? '+' : ''}
                  {change}%
                </span>
              )}
            </div>
          </div>
          {icon && (
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
