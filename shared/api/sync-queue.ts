import Dexie, { Table } from "dexie";

export interface SyncQueueItem {
  id?: number;
  action: "UPLOAD_PHOTO" | "UPLOAD_SIGNATURE" | "UPDATE_STATUS";
  payload: any;
  timestamp: number;
  attempts: number;
  status?: "pending" | "failed_permanently";
}

export class SyncDatabase extends Dexie {
  sync_queue!: Table<SyncQueueItem>;

  constructor() {
    super("RealStoneSyncDB");
    this.version(1).stores({
      sync_queue: "++id, action, timestamp, attempts, status",
    });
  }
}

export const db = new SyncDatabase();

// Routine to purge photo blobs from local storage once a sync to Supabase is successful.
export const purgePhotoBlobs = (jobId?: string) => {
  if (typeof window === "undefined") return;

  if (jobId) {
    sessionStorage.removeItem(`field_captures_${jobId}`);
    localStorage.removeItem(`field_captures_${jobId}`);
  } else {
    // Purge all field captures if no specific jobId is provided
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("field_captures_")) {
        sessionStorage.removeItem(key);
      }
    });
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("field_captures_")) {
        localStorage.removeItem(key);
      }
    });
  }
};
