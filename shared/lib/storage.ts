import { get, set, del, keys } from 'idb-keyval';

/**
 * Lightweight IndexedDB wrapper for large field captures
 */
export const fieldStorage = {
  async getItem(key: string): Promise<any | null> {
    try {
      return await get(key);
    } catch (err) {
      console.error('IDB Get Error:', err);
      return null;
    }
  },

  async setItem(key: string, value: any): Promise<void> {
    try {
      await set(key, value);
    } catch (err) {
      console.error('IDB Set Error:', err);
      // If IndexedDB fails (rare), we don't want to crash but we should log it
      if (err instanceof Error && err.name === 'QuotaExceededError') {
        console.error('IndexedDB Quota Exceeded');
      }
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await del(key);
    } catch (err) {
      console.error('IDB Delete Error:', err);
    }
  },

  async purgeAll(prefix: string = 'field_captures_'): Promise<void> {
    try {
      const allKeys = await keys();
      const targets = allKeys.filter(k => typeof k === 'string' && k.startsWith(prefix));
      for (const key of targets) {
        await del(key);
      }
    } catch (err) {
      console.error('IDB Purge Error:', err);
    }
  }
};
