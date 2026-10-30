/**
 * High-Capacity IndexedDB storage manager for D'Calabash Hotel.
 * Overcomes localStorage's 5MB quota limitation to persist high-resolution photographs,
 * room categories, menu items, and settings across browser refreshes.
 */

const DB_NAME = 'DCalabashHotelDB_v1';
const DB_VERSION = 1;
const STORE_NAME = 'hotel_data';

class StorageDb {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDb(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported in this environment'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  public async set<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(value, key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn(`IndexedDB set failed for ${key}:`, err);
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => {
          resolve(request.result !== undefined ? request.result : null);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn(`IndexedDB get failed for ${key}:`, err);
      return null;
    }
  }

  public async remove(key: string): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn(`IndexedDB remove failed for ${key}:`, err);
    }
  }

  public async clear(): Promise<void> {
    try {
      const db = await this.getDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn('IndexedDB clear failed:', err);
    }
  }
}

export const storageDb = new StorageDb();
