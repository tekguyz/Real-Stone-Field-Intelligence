import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { db } from '../api/sync-queue';
import { jobService } from '../../entities/job/api';
import { useUserStore } from '../../entities/user/store';

export type SyncStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING';

export function useSyncManager() {
  const [status, setStatus] = useState<SyncStatus>('ONLINE');
  const [pendingCount, setPendingCount] = useState(0);
  const { isDevMode } = useUserStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Initial check
    if (typeof window !== 'undefined') {
      setStatus(navigator.onLine ? 'ONLINE' : 'OFFLINE');
    }

    const checkQueue = async () => {
      const count = await db.sync_queue.count();
      setPendingCount(count);
      // Auto-flush on mount if we're online and there is pending work
      if (count > 0 && navigator.onLine && status !== 'SYNCING') {
        flushQueue();
      }
    };

    const handleOnline = () => {
      setStatus('ONLINE');
      flushQueue();
    };

    const handleOffline = () => {
      setStatus('OFFLINE');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial queue count check
    checkQueue();

    // Poll the queue count periodically if offline
    const interval = setInterval(checkQueue, 2000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const flushQueue = async () => {
    const items = await db.sync_queue.orderBy('timestamp').toArray();
    if (items.length === 0) return;

    setStatus('SYNCING');

    for (const item of items) {
      try {
        if (item.action === 'UPLOAD_PHOTO') {
          // Await the upload of photo BEFORE updating status
          await jobService.uploadPhoto(item.payload.blob, item.payload.jobId, isDevMode);
        } else if (item.action === 'UPLOAD_SIGNATURE') {
          await jobService.uploadSignature(item.payload.data, item.payload.jobId, isDevMode);
        } else if (item.action === 'UPDATE_STATUS') {
          await jobService.updateJobStatus(
            item.payload.jobId, 
            item.payload.newStatus, 
            isDevMode
          );
        }
        await db.sync_queue.delete(item.id!);
      } catch (err) {
        console.error('Sync failed for item', item, err);
        // Increment attempts and stop processing further sequence for this job to maintain invariant
        await db.sync_queue.update(item.id!, { attempts: item.attempts + 1 });
        break; // DONT proceed to next items if current fails to guarantee sequential constraint
      }
    }

    const remaining = await db.sync_queue.count();
    setPendingCount(remaining);
    setStatus(navigator.onLine ? 'ONLINE' : 'OFFLINE');
    
    if (remaining === 0) {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    }
  };

  return { status, pendingCount };
}
