import Dexie, { Table } from 'dexie';

export interface SyncQueueItem {
  id?: number;
  action: 'UPLOAD_PHOTO' | 'UPLOAD_SIGNATURE' | 'UPDATE_STATUS';
  payload: any;
  timestamp: number;
  attempts: number;
  status?: 'pending' | 'failed_permanently';
}

export class SyncDatabase extends Dexie {
  sync_queue!: Table<SyncQueueItem>;

  constructor() {
    super('RealStoneSyncDB');
    this.version(1).stores({
      sync_queue: '++id, action, timestamp, attempts, status'
    });
  }
}

export const db = new SyncDatabase();
