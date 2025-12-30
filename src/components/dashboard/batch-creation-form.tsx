'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AnimatedCard } from '@/components/shared/animated-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { scraperApi } from '@/lib/api/scraper';
import { batchScrapeSchema, transformUrls, type BatchScrapeFormData } from '@/lib/utils/validators';

export function BatchCreationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BatchScrapeFormData>({
    resolver: zodResolver(batchScrapeSchema),
    defaultValues: {
      max_workers: 4,
      max_records_per_file: 50,
      priority: 3,
    },
  });

  const onSubmit = async (data: BatchScrapeFormData) => {
    setIsSubmitting(true);
    try {
      const urls = transformUrls(data.urls);

      const response = await scraperApi.startBatch({
        urls,
        max_workers: data.max_workers,
        max_records_per_file: data.max_records_per_file,
        priority: data.priority,
      });

      if (response.success) {
        toast.success('Batch started successfully!', {
          description: `Batch ID: ${response.batch_id}`,
        });
        reset();
      } else {
        toast.error('Failed to start batch', {
          description: response.message,
        });
      }
    } catch (error) {
      toast.error('Error starting batch', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedCard title="Create Batch" description="Start a new scraping batch" animationType="slide">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="urls">URLs (one per line)</Label>
          <Textarea
            id="urls"
            placeholder="https://example.com/jobs&#10;https://another-site.com/careers"
            rows={5}
            {...register('urls')}
            className="font-mono text-sm"
          />
          {errors.urls && <p className="text-sm text-destructive">{errors.urls.message}</p>}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="max_workers">Max Workers</Label>
            <Input id="max_workers" type="number" min={1} max={10} {...register('max_workers', { valueAsNumber: true })} />
            {errors.max_workers && <p className="text-sm text-destructive">{errors.max_workers.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_records_per_file">Max Records</Label>
            <Input
              id="max_records_per_file"
              type="number"
              min={1}
              max={500}
              {...register('max_records_per_file', { valueAsNumber: true })}
            />
            {errors.max_records_per_file && (
              <p className="text-sm text-destructive">{errors.max_records_per_file.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority (1-5)</Label>
            <Input id="priority" type="number" min={1} max={5} {...register('priority', { valueAsNumber: true })} />
            {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Starting Batch...' : 'Start Batch'}
        </Button>
      </form>
    </AnimatedCard>
  );
}
