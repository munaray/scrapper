'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

export type AnimationType = 'fade' | 'slide' | 'scale';

interface AnimatedCardProps extends Omit<HTMLMotionProps<'div'>, 'title'> {
  animationType?: AnimationType;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const animations: Record<AnimationType, any> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4 },
  },
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export function AnimatedCard({
  animationType = 'fade',
  title,
  description,
  footer,
  children,
  className,
  ...props
}: AnimatedCardProps) {
  const animation = animations[animationType];

  return (
    <motion.div {...animation} {...props}>
      <Card className={cn('h-full', className)}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </motion.div>
  );
}
