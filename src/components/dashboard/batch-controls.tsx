'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { AnimatedCard } from '@/components/shared/animated-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { scraperApi } from '@/lib/api/scraper';
import { useBatchProgress } from '@/lib/hooks/useBatchProgress';

export function BatchControls() {
  const { data, refetch } = useBatchProgress();
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [forceStop, setForceStop] = useState(false);

  const isRunning = data?.is_running === true;

  const handleStop = async () => {
    setIsStopping(true);
    try {
      const response = await scraperApi.stopBatch({ force: forceStop });

      if (response.success) {
        toast.success('Batch stopped', {
          description: response.message,
        });
        setShowStopDialog(false);
        refetch();
      } else {
        toast.error('Failed to stop batch', {
          description: response.message,
        });
      }
    } catch (error) {
      toast.error('Error stopping batch', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsStopping(false);
      setForceStop(false);
    }
  };

  return (
    <>
      <AnimatedCard title="Batch Controls" animationType="slide">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {isRunning
              ? 'A batch is currently running. You can stop it using the button below.'
              : 'No active batch is running.'}
          </div>
          <Button
            variant="destructive"
            className="w-full"
            disabled={!isRunning}
            onClick={() => setShowStopDialog(true)}
          >
            Stop Batch
          </Button>
          {!isRunning && (
            <p className="text-xs text-center text-muted-foreground">
              Start a batch to enable controls
            </p>
          )}
        </div>
      </AnimatedCard>
      <Dialog open={showStopDialog} onOpenChange={setShowStopDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stop Batch?</DialogTitle>
            <DialogDescription>
              Are you sure you want to stop the current batch? Running tasks will be cancelled and pending tasks will not be started.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2 py-4">
            <input
              type="checkbox"
              id="force"
              checked={forceStop}
              onChange={(e) => setForceStop(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="force" className="text-sm font-normal cursor-pointer">
              Force stop immediately (may interrupt running tasks)
            </Label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStopDialog(false)} disabled={isStopping}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleStop} disabled={isStopping}>
              {isStopping ? 'Stopping...' : 'Stop Batch'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
